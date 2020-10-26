import {CanvasController} from './CanvasController.js'
import {GraphPrinter} from './GraphPrinter.js'
import {Stepper} from './Stepper.js'

class CanvasControllerNodeIndexer extends CanvasController
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
        this.setState ("Algorithm  '" + this.algorithm.name + "' Ready. Click on the graph to select as starting node")
        
        
    }

    stop ()
    {
        this.stepper.stop ()
        if (this.view)
            this.view.canvas.removeEventListener ('click', this.mouseClickListener)
        this.graph.print (this.printer,this.view.canvas)
        this.setState ("Graph Node Indexer stopped")
    }

    mouseClick (e)
    {
        if (e.button == 0) {
            var startingNode = this.nodeClicked (this.getCanvasEventCoordinates (e))
            if (startingNode) {
                this.setState (startingNode + " selected as starting node")
                this.stepper.stop ()
                this.graph.print (this.printer,this.view.canvas)
                this.setState (" Algorithm '" + this.algorithm.name + "' running")
                this.algorithm.run (this.graph,startingNode)

                this.stepThrough (this.algorithm.output.visited_nodes)

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
        this.graph.nodes.forEach (n => {
            n.index = null
            this.graph.resetVertexPrintStyles (n)
        })
    }

    getInfo ()
    {
        return "Graph Node Indexer" + 
        "</br>- Uses given algorithm to index graph nodes" + 
        "</br> - Algorithm used:  " + this.algorithm.name 
    }

    stepThrough (indexedNodes)
    {
        var curIndex = 0
        this.stepper.walk (
            function () {
                indexedNodes[curIndex].strokeColor = 'black'
                indexedNodes[curIndex].fillColor = 'yellow'
                indexedNodes[curIndex].index = ++curIndex
                this.graph.print (this.printer,this.view.canvas)

                this.graph.nodes.forEach (n => {
                    if (n.index) {
                        this.context.beginPath ()
                        this.context.font = "12px Arial"
                        this.context.fillStyle = 'red'
                        this.context.fillText(n.index, n.position.x, n.position.y - this.graph.nodeRadius - 5);
                        this.context.stroke()
                    }
                    
                })
                


            }.bind (this), 
            function () {
                return curIndex < indexedNodes.length
            },
            function () {
                this.cleanUp ()
                this.view.canvas.addEventListener ('click', this.mouseClickListener)
                this.setState ("Algorithm '" + this.algorithm.name + "' finished. Click on some node to run again")
            }.bind (this)
        )
    }
}

export {CanvasControllerNodeIndexer}