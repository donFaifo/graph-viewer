import {CanvasController} from './CanvasController.js'
import {Stepper} from './Stepper.js'

class CanvasControllerPathTracer extends CanvasController
{
    constructor (graphPrinter)
    {
        super ()
        this.stepper = new Stepper (700)
        this.graphPrinter = graphPrinter
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
        this.graphPrinter.drawGraph (this.graph,this.view.canvas)
        this.setState ("Graph Path Tracer stopped")
    }

    mouseClick (e)
    {
        if (e.button == 0) {
            var startingNode = this.nodeClicked (this.getCanvasEventCoordinates (e))
            if (startingNode) {
                this.setState (startingNode + " selected as starting node")
                this.stepper.stop ()
                this.graphPrinter.drawGraph (this.graph,this.view.canvas)
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
                if (node_center_rel_click_position.len () < this.graphPrinter.nodeRadius) {
                    this.graph.nodes[i].click_position = node_center_rel_click_position
                    return this.graph.nodes[i]
                }      
            }
                
        }
        return null
    }

    stepThrough (indexedNodes)
    {
        var curIndex = 0
        this.stepper.walk (
            function () {
                if (curIndex > 0) {
                    this.graphPrinter.drawEdge (indexedNodes[curIndex].originNode,indexedNodes[curIndex],this.context,'blue',this.graph.directed,3)
                    var v_1to2 = indexedNodes[curIndex].position.substract (indexedNodes[curIndex].originNode.position)
                    var midPoint = indexedNodes[curIndex].originNode.position.add (v_1to2.unit ().multiply (v_1to2.len ()/2))
                    var textPos = midPoint.add (v_1to2.getUnitNormalCCW ().multiply (12))
                    this.context.beginPath ()
                    this.context.font = "12px Arial"
                    this.context.fillStyle = 'red'
                    this.context.fillText(curIndex, textPos.x, textPos.y);
                    this.context.stroke()
                }
                this.graphPrinter.drawNode (indexedNodes[curIndex], this.context, 'black', 'yellow')
                
                curIndex++
            }.bind (this), 
            function () {
                return curIndex < indexedNodes.length
            },
            function () {
                this.view.canvas.addEventListener ('click', this.mouseClickListener)
                this.setState ("Algorithm finished. Click on some node to run again")
            }.bind (this)
        )
    }
}

export {CanvasControllerPathTracer}