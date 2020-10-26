import {CanvasController} from './CanvasController.js'
import {DFScycles} from './algorithms/cyclesWithDfs.js'
import {DFSr} from './algorithms/DFSr.js'
import {Printer} from './Printer.js'

class CanvasControllerGraphEditor extends CanvasController
{
    constructor (printer)
    {
        super ()
        this.printer = printer
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
        this.graph.print (this.printer,this.view.canvas)
        this.setState ("Graph Editor ready.")
    }

    getInfo ()
    {
        return "Graph Editor" + 
        "</br>- Click on canvas to create new node" + 
        "</br> - Double click to select node and move to reposition the node (release after dblclick before move) " + 
        "</br> - Click on the node and drag to create edge" +
        "</br> - Right Click on the node to erase it " +
        "</br> - In weighted graph, Click on the edge weight to change it "
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
        let node = this.nodeClicked (clickPosition)
        let edge = this.edgeClicked (clickPosition)
        switch (e.button) {
            case 0 :
                if (!node && !edge) {
                    this.createNewVertex (clickPosition)
                    this.graph.print (this.printer,this.view.canvas)
                }
                else if (node){
                    this.startNewEdge (node,e)
                }
                else if (edge){
                    this.updateEdgeWeight (edge,clickPosition)
                }
                break
            case 2 :
                if (node) {
                    this.deleteVertex (node)
                    this.graph.print (this.printer,this.view.canvas)
                }
                break
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

    edgeClicked (clickPosition)
    {
        let return_value
        this.graph.currentPrintableEdges.forEach (e => {
            var weight_center_rel_click_position = clickPosition.substract (e.weightPosition)
            if (weight_center_rel_click_position.len () < this.graph.edgeWeightRadius) {
                return_value = e
                return
            } 
        })

        return return_value
    }

    updateEdgeWeight (edge)
    {
        let cont = document.createElement ('div')
        var text =document.createTextNode("New weight value: ")
        var weight = document.createElement ('input')
        weight.value = edge.weight
        var b = document.createElement ('button')
        b.onclick = function () {
            if (Number.isInteger (parseInt(weight.value)) && parseInt(weight.value) > 0) {
                this.graph.setWeight (edge.startVertex,edge.endVertex,parseInt(weight.value))
                this.graph.print (this.printer,this.view.canvas)
                this.updateGraphInfo ()
            }
            else {
                if (!cont.error_showed) {
                    cont.appendChild (document.createTextNode("Error: need int greater than 0"))
                    cont.error_showed = true
                }

            }
            
        }.bind (this)
        b.innerText = 'Save'
        cont.appendChild (text)
        cont.appendChild (weight)
        cont.appendChild (b)
        this.setState (cont)
    }

    createNewVertex (clickPosition)
    {
        let vertex = this.graph.addNode (null,clickPosition)
        this.updateGraphInfo ()
    }

    startNewEdge (node,e)
    {
        this.selected_node = node
        this.selected_node.strokeColor = 'green'
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
        if (this.hovered_node)
            this.graph.resetVertexPrintStyles (this.hovered_node)
        this.graph.resetVertexPrintStyles (this.selected_node)
        this.selected_node = null
        this.hovered_node = null
        this.graph.print (this.printer,this.view.canvas)
    }

    drawLine (e)
    {
        if (this.hovered_node && this.hovered_node != this.selected_node)
            this.graph.resetVertexPrintStyles (this.hovered_node)
        var pos = this.getCanvasEventCoordinates (e)
        this.hovered_node = this.nodeClicked (pos)
        if (this.hovered_node && this.hovered_node != this.selected_node) {
            this.hovered_node.strokeColor = 'green'
        }
        this.graph.print (this.printer,this.view.canvas)
        this.context.beginPath ()
        this.context.setLineDash ([])
        this.context.moveTo (this.selected_node.position.x,this.selected_node.position.y)
        this.context.lineTo (pos.x,pos.y)
        this.context.strokeStyle = 'green'
        this.context.stroke ()
    }

    deleteVertex (node)
    {
        this.graph.removeNode (node)
        this.updateGraphInfo ()
    }

    selectNode (e)
    {
        let node = this.nodeClicked (this.getCanvasEventCoordinates (e))
        if (!node)
            return
        this.selected_node = node
        this.selected_node.strokeColor = 'green'
        this.graph.print (this.printer,this.view.canvas)
        
        this.view.canvas.addEventListener ('mousemove',this.dragNodeListener)
        document.addEventListener ('mousedown',this.stopDragNodeListener)
        this.view.canvas.removeEventListener ('mousedown', this.mouseClickListener)
    }

    dragNode (e)
    {
        var clickPosition = this.getCanvasEventCoordinates (e)
        this.selected_node.position = this.selected_node.position.add (clickPosition.substract (this.selected_node.position).substract (this.selected_node.click_position))
        this.graph.print (this.printer,this.view.canvas)
    }

    stopDragNode ()
    {
        this.view.canvas.removeEventListener ('mousemove',this.dragNodeListener)
        document.removeEventListener ('mousedown',this.stopDragNodeListener)
        this.view.canvas.addEventListener ('mousedown', this.mouseClickListener)
        this.graph.resetVertexPrintStyles (this.selected_node)
        this.selected_node = null
        this.graph.print (this.printer,this.view.canvas)
    }
}

export {CanvasControllerGraphEditor}