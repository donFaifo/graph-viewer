import {CanvasController} from './CanvasController.js'
import {Stepper} from './Stepper.js'

class CanvasControllerPathTracer extends CanvasController
{
    constructor (printer)
    {
        super ()
        this.stepper = new Stepper (700)
        this.printer = printer
        this.mouseClickListener = this.mouseClick.bind (this)
    }

    start (view, graph, algorithm)
    {
        
        this.view = view
        this.context = this.view.canvas.getContext ('2d')
        this.graph = graph
        this.algorithm = algorithm
        this.view.canvas.addEventListener ('click', this.mouseClickListener)
        this.setState ("Algorithm Ready. Click on the graph to select as starting node")
        
        
    }

    stop ()
    {
        this.stepper.stop ()
        this.view.canvas.removeEventListener ('click', this.mouseClickListener)
        this.graph.print (this.printer,this.view.canvas)
        this.setState ("Graph Path Tracer stopped")
    }

    mouseClick (e)
    {
        if (e.button == 0) {
            var startingNode = this.nodeClicked (this.getCanvasEventCoordinates (e))
            if (startingNode) {
                this.setState (startingNode + " selected as starting node")
                this.stepper.stop ()
                this.graph.print (this.printer,this.view.canvas)
                this.setState (" Algorithm running")
                this.algorithm.run (this.graph,startingNode)

                this.stepThrough (this.algorithm.output.visited_nodes)

            }
            else {
                alert (this.algorithm.showSource ())
            }
        }
    }

    nodeClicked (clickPosition)
    {
        for (var i = 0;i<this.graph.nodes.length;i++){
            if (this.graph.nodes[i].position) {
                var node_center_rel_click_position = clickPosition.substract (this.graph.nodes[i].position)
                if (node_center_rel_click_position.len () < this.graph.nodeRadius) {
                    this.graph.nodes[i].click_position = node_center_rel_click_position
                    return this.graph.nodes[i]
                }      
            }
                
        }
        return null
    }
    cleanUp ()
    {
        this.graph.currentPrintableEdges.forEach (e => {
            e.index = null
        })
        this.graph.resetAllPrintStyles ()
    }

    getInfo ()
    {
        return "Graph Path Tracer" + 
        "</br>- Uses given algorithm to trace a path in the graph" + 
        "</br> - Algorithm used:  <b>" + this.algorithm.name + "</b>"
    }

    stepThrough (indexedNodes)
    {
        var curIndex = 0
        this.stepper.walk (
            function () {
                if (curIndex > 0) {
                    this.graph.currentPrintableEdges.forEach (e => {
                        if (e.startVertex.id == indexedNodes[curIndex].originNode.id && e.endVertex.id == indexedNodes[curIndex].id ||
                            e.endVertex.id == indexedNodes[curIndex].originNode.id && e.startVertex.id == indexedNodes[curIndex].id) {
                            console.log ('found')
                            e.index = curIndex
                            e.color = 'blue'
                            e.width = 3
                        }
                    })
                }
                indexedNodes[curIndex].strokeColor = 'black'
                indexedNodes[curIndex].fillColor = 'yellow'
                this.graph.print (this.printer,this.view.canvas)
                this.graph.currentPrintableEdges.forEach (e => {
                    if (e.index) {
                        var v_1to2 = e.endVertex.position.substract (e.startVertex.position)
                        var midPoint = e.startVertex.position.add (v_1to2.unit ().multiply (v_1to2.len ()/2))
                        var textPos = midPoint.add (v_1to2.getUnitNormalCCW ().multiply (12))
                        this.context.beginPath ()
                        this.context.font = "12px Arial"
                        this.context.fillStyle = 'red'
                        this.context.fillText(e.index, textPos.x, textPos.y);
                        this.context.stroke()
                    }
                })
                curIndex++
            }.bind (this), 
            function () {
                return curIndex < indexedNodes.length
            },
            function () {
                let cost = 0
                this.graph.currentPrintableEdges.forEach (e => {if (e.index) cost += e.weight})
                this.cleanUp ()
                this.view.canvas.addEventListener ('click', this.mouseClickListener)
                
                this.setState ("Algorithm finished. " + 
                "</br> - Number of edges: " + (this.algorithm.output.visited_nodes.length - 1) +
                "</br> - Path cost: " + cost +
                "</br> - Click on some node to run again")
            }.bind (this)
        )
    }
}

export {CanvasControllerPathTracer}