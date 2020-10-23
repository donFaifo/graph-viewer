import {CanvasController} from './CanvasController.js'
import {GraphPrinter} from './GraphPrinter.js'
import {Stepper} from './Stepper.js'

class CanvasControllerNodeIndexer extends CanvasController
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
        this.setState ("Algorithm  '" + this.algorithm.name + "' Ready. Click on the graph to select as starting node")
        
        
    }

    stop ()
    {
        this.stepper.stop ()
        if (this.view)
            this.view.canvas.removeEventListener ('click', this.mouseClickListener)
        this.graphPrinter.drawGraph (this.graph,this.view.canvas)
        this.setState ("Graph Node Indexer stopped")
    }

    mouseClick (e)
    {
        if (e.button == 0) {
            var startingNode = this.nodeClicked (this.getCanvasEventCoordinates (e))
            if (startingNode) {
                this.setState (startingNode + " selected as starting node")
                this.stepper.stop ()
                //this.view.canvas.removeEventListener ('click', this.mouseClickListener)
                this.graphPrinter.drawGraph (this.graph,this.view.canvas)
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
                this.graphPrinter.drawNode (indexedNodes[curIndex], this.context, 'black', 'yellow')

                this.context.beginPath ()
                this.context.font = "12px Arial"
                this.context.fillStyle = 'red'
                this.context.fillText(curIndex+1, indexedNodes[curIndex].position.x, indexedNodes[curIndex].position.y - this.graphPrinter.nodeRadius - 5);
                this.context.stroke()

                curIndex++
            }.bind (this), 
            function () {
                return curIndex < indexedNodes.length
            },
            function () {
                this.view.canvas.addEventListener ('click', this.mouseClickListener)
                this.setState ("Algorithm '" + this.algorithm.name + "' finished. Click on some node to run again")
            }.bind (this)
        )
    }
}

export {CanvasControllerNodeIndexer}