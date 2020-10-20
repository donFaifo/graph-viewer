import {CanvasController} from './CanvasController.js'
import {DFScycles} from './algorithms/cyclesWithDfs.js'
import {DFSr} from './algorithms/DFSr.js'

class CanvasControllerGraphEditor extends CanvasController
{
    constructor (graphPrinter)
    {
        super ()
        this.graphPrinter = graphPrinter

        this.mouseClickListener = this.mouseClick.bind (this)
        this.selectNodeListener = this.selectNode.bind (this)
        this.drawLineListener = this.drawLine.bind (this)
        this.stopNewEdgeListener = this.stopNewEdge.bind (this)
        this.dragNodeListener = this.dragNode.bind (this)
        this.stopDragNodeListener = this.stopDragNode.bind (this)

        this.selected_node = null
        this.hovered_node = null
    }

    start (view, graph)
    {
        this.view = view
        this.context = this.view.canvas.getContext ('2d')
        this.graph = graph
        this.graphInfo = {}
        this.cycleFinder = new DFScycles (this.graph)
        this.view.canvas.addEventListener ('mousedown', this.mouseClickListener)
        this.view.canvas.addEventListener ('dblclick', this.selectNodeListener)
        this.view.canvas.oncontextmenu = function () {return false}
        this.graphPrinter.drawGraph (this.graph, this.view.canvas)
        this.setState ("Graph Editor ready. </br>" + 
                    "</br>- Click on canvas to create new node" + 
                    " </br> - Double click to select node and move to reposition the node (release after dblclick before move) " + 
                    "</br> - Click on the node and drag to create edge" +
                    "</br> - Right Click on the node to erase it ")
    }

    updateGraphInfo ()
    {
        this.graphInfo.numNodes = this.graph.size
        this.graphInfo.numEdges = this.graph.getNumEdgesM ()
        this.cycleFinder.run (this.graph)
        this.graphInfo.hasCycles = this.cycleFinder.output.has_cycles
        var dfs = new DFSr ('DFSr')
        dfs.run (this.graph,this.graph.nodes[0])
        this.graphInfo.connected = dfs.output.visited_nodes.length == this.graph.nodes.length
        this.setState ("Nodes: " + this.graphInfo.numNodes + 
                        "</br> Edges: " + this.graphInfo.numEdges + 
                        "</br> Cycles exist: " + this.graphInfo.hasCycles +
                        "</br> Connected: " + this.graphInfo.connected)
    }

    stop ()
    {
        this.view.canvas.removeEventListener ('mousedown', this.mouseClickListener)
        this.view.canvas.removeEventListener ('dblclick', this.selectNodeListener)
        this.setState ("Graph Editor stopped")
    }

    mouseClick (e)
    {
        var clickPosition = this.getCanvasEventCoordinates (e)
        let node = this.nodeInRange (clickPosition)
        switch (e.button) {
            case 0 :
                if (!node) {
                    this.createNewVertex (clickPosition)
                    this.graphPrinter.drawGraph (this.graph, this.view.canvas)
                }
                else {
                    this.startNewEdge (node,e)
                }
                break
            case 2 :
                if (node) {
                    this.deleteVertex (node)
                    this.graphPrinter.drawGraph (this.graph, this.view.canvas)
                }
                break
        }
    }

    nodeInRange (clickPosition)
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

    createNewVertex (clickPosition)
    {
        let vertex = this.graph.addVertex ()
        this.updateGraphInfo ()
        vertex.position = clickPosition
        return vertex
    }

    startNewEdge (node,e)
    {
        this.selected_node = node
        this.drawLine (e)

        this.view.canvas.addEventListener ('mousemove',this.drawLineListener)
        this.view.canvas.addEventListener ('mouseup',this.stopNewEdgeListener)
    }

    stopNewEdge ()
    {
        if (this.selected_node && this.hovered_node && this.hovered_node != this.selected_node) {
            this.graph.addEdge (this.selected_node,this.hovered_node)
            this.updateGraphInfo ()
        }
        this.view.canvas.removeEventListener ('mousemove',this.drawLineListener)
        this.view.canvas.removeEventListener ('mouseup',this.stopNewEdgeListener)
        this.selected_node = null
        this.hovered_node = null
        this.resetNodesColor ()
        this.graphPrinter.drawGraph (this.graph, this.view.canvas)
    }

    drawLine (e)
    {
        this.resetNodesColor ()
        var pos = this.getCanvasEventCoordinates (e)
        this.hovered_node = this.nodeInRange (pos)
        if (this.hovered_node && this.hovered_node != this.selected_node)
            this.hovered_node.color = 'green'
        this.selected_node.color = 'green'
        this.graphPrinter.drawGraph (this.graph, this.view.canvas)
        this.context.beginPath ()
        this.context.moveTo (this.selected_node.position.x,this.selected_node.position.y)
        this.context.lineTo (pos.x,pos.y)
        this.context.strokeStyle = 'green'
        this.context.stroke ()
    }

    resetNodesColor ()
    {
        for (var i = 0;i<this.graph.nodes.length;i++){
            this.graph.nodes[i].color = null
        }
    }

    deleteVertex (node)
    {
        this.graph.removeVertex (node)
        this.updateGraphInfo ()
    }

    selectNode (e)
    {
        this.resetNodesColor ()
        let node = this.nodeInRange (this.getCanvasEventCoordinates (e))
        if (!node)
            return
        this.selected_node = node
        node.color = 'green'
        this.graphPrinter.drawGraph (this.graph, this.view.canvas)
        
        this.view.canvas.addEventListener ('mousemove',this.dragNodeListener)
        document.addEventListener ('mousedown',this.stopDragNodeListener)
        this.view.canvas.removeEventListener ('mousedown', this.mouseClickListener)
    }

    dragNode (e)
    {
        var clickPosition = this.getCanvasEventCoordinates (e)
        this.selected_node.position = this.selected_node.position.add (clickPosition.substract (this.selected_node.position).substract (this.selected_node.click_position))
        this.graphPrinter.drawGraph (this.graph, this.view.canvas)
    }

    stopDragNode ()
    {
        this.view.canvas.removeEventListener ('mousemove',this.dragNodeListener)
        document.removeEventListener ('mousedown',this.stopDragNodeListener)
        this.view.canvas.addEventListener ('mousedown', this.mouseClickListener)
        this.selected_node.color = null
        this.selected_node = null
        this.graphPrinter.drawGraph (this.graph, this.view.canvas)
    }
}

export {CanvasControllerGraphEditor}