import {Graph} from './data_structures/Graph.js'

/**
 * A wraper class for Graph data structure.
 * Adds some info on each node, needed for printing nodes on canvas
 * Also sets default values like nodeRadius,edgeColor...
 * Implements print method for priting the graph on canvas
 * It is ment to substitute the old way of printing graphs with GraphPrinter
 */
class GraphPrintable extends Graph
{
    /**
     * Constuctor
     * @param {String} name name of hte graph
     */
    constructor (name)
    {
        super (name)
        this.nodeRadius = 20
        this.nodeWidth = 1
        this.nodeFont = "15px Arial"
        this.strokeColor = 'black'
        this.fillColor = 'white'
        this.nodeLineDash = []
        this.edgeColor = 'black'
        this.edgeWidth = 1
        this.edgeLineDash = []
        this.edgeWeightRadius = 10

        //this array is populated each time the grapf is printed. 
        //It stores the edges printed on the screen
        //For not directed graph the number of edges printed is less than or equal to total graph edge number
        //due to printing just the upper half of adjacency matrix
        this.currentPrintableEdges = []
    }

    /**
     * Sets to default all print options for a given node
     * @param {Node} node 
     */
    resetVertexPrintStyles (node)
    {
        node.nodeRadius = 20
        node.width = 1
        node.nodeFont = "15px Arial"
        node.strokeColor = 'black'
        node.fillColor = 'white'
        node.nodeLineDash = []
    }

    /**
     * Sets to default all print options for a given edge
     * @param {Edge} edge 
     */
    resetEdgePrintStyles (edge)
    {
        edge.color = 'black'
        edge.width = 1
        edge.lineDash = []
    }

    /**
     * resets print styles on all nodes and edges of the graph
     */
    resetAllPrintStyles ()
    {
        this.nodes.forEach (n => this.resetVertexPrintStyles (n))
        this.currentPrintableEdges.forEach (e => this.resetEdgePrintStyles (e))
    }

    /**
     * Override of the Graph class method.
     * It sets some aditional values for printing the node
     * @param {String or Number} value Node value
     * @param {Vector2D} position Node position on canvas
     * @param {Number} radius Radius of the circle that will be printed on canvas
     * @param {String} strokeColor color of the circle edges and text
     * @param {String} fillColor color for filling the circle
     * @param {String} font String like '<Number>px <font name>' defining font for text inside circle
     */
    addNode (value,position,radius,width,strokeColor,fillColor,font,lineDash)
    {
        let newNode = super.addNode (value)
        newNode.position = position
        newNode.radius = radius || this.nodeRadius
        newNode.width = width || this.nodeWidth
        newNode.strokeColor = strokeColor || this.strokeColor
        newNode.fillColor = fillColor || this.fillColor
        newNode.font = font || this.nodeFont
        newNode.lineDash = lineDash || this.nodeLineDash
        return newNode
    }

    removeNode (n)
    {
        super.removeNode (n)
        let copy = Array.from(this.currentPrintableEdges)
        copy.forEach (e => {
            if (e.startVertex.id == n.id || e.endVertex.id == n.id) {
                this.currentPrintableEdges.splice (
                    this.currentPrintableEdges.indexOf (e),1)
            }
        })
    }

    addEdge (n1,n2,weight)
    {
        super.addEdge (n1,n2,weight)
        let contains = false
        this.currentPrintableEdges.forEach (e => {
            if (e.startVertex.id == n1.id && e.endVertex.id == n2.id) {
                contains = true
                return
            }
        })
        if (!contains) {
            let e = new Edge (
                n1,
                n2,
                this.directed,
                weight || 1,
                this.edgeColor,
                this.edgeWidth,
                this.edgeLineDash,
                null)
            this.currentPrintableEdges.push (e)
        }
    }

    removeEdge (n1,n2)
    {
        super.removeEdge (n1,n2)
        this.currentPrintableEdges.forEach (e => {
            if (e.startVertex.id == n1.id && e.endVertex.id == n2.id) {
                this.currentPrintableEdges.splice (this.currentPrintableEdges.indexOf (e),1)
                return
            }
        })
    }

    setWeight (n1,n2,weight)
    {
        super.setWeight (n1,n2,weight)
        this.currentPrintableEdges.forEach (e => {
            if (e.startVertex.id == n1.id && e.endVertex.id == n2.id) {
                e.weight = weight || 1
            }
        })
    }

    /**
     * 
     * @param {Printer} printer instance of Printer class used to print nodes and edges
     * @param {canvas} canvas canvas Element
     */
    print (printer,canvas)
    {
        var context = canvas.getContext ("2d")
        context.clearRect (0,0,canvas.width,canvas.height)

        this.nodes.forEach (n => printer.printVertex (context,n))

        //this.currentPrintableEdges.length = 0
        //this.setCurrentPrintableEdges ()

        this.currentPrintableEdges.forEach (e => printer.printEdge (context,e,this.weighted))

    }

    /**
     * populates currentPrintableEdges array
     * In undirected and unweighted graph only edges of the lower half of adjacency matrix are printed
     */
    setCurrentPrintableEdges ()
    {
        for (var i = 0;i < this.size;i++) {
            for (var j = ((this.directed && !this.weighted) ? 0 : i);j < this.size;j++) {
                let weight = this.insMatrix.get (i,j)
                if (weight > 0) {
                    let e = new Edge (
                        this.nodes [i],
                        this.nodes [j],
                        this.directed,
                        weight,
                        this.edgeColor,
                        this.edgeWidth,
                        this.edgeLineDash,
                        null)
                    this.currentPrintableEdges.push (e)
                }
            }
        }
    }

}

/**
 * just a structure to hold information about the edge
 * used in setCurrentPrintableEdges method
 */
class Edge
{
    constructor (startVertex,endVertex,directed,weight,color,width,lineDash,weightPosition)
    {
        this.startVertex = startVertex
        this.endVertex = endVertex
        this.directed = directed
        this.weight = weight
        this.color = color
        this.width = width
        this.lineDash = lineDash
        this.weightPosition = weightPosition
    }
}

export {GraphPrintable}