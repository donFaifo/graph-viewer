class GraphPrinter
{
    constructor ()
    {
        this.nodeRadius = 20
        this.nodeFont = "15px Arial"
        this.nodeColor = 'black'
        this.edgeColor = 'black'
    }
    drawGraph (graph, canvas)
    {
        var context = canvas.getContext ("2d")
        context.clearRect (0,0,canvas.width,canvas.height)

        this.drawAllNodes (graph,context)
        this.drawAllEdges (graph,context)
    }

    drawAllNodes (graph,context)
    {
        for (var i = 0;i < graph.size;i++) {
            this.drawNode (graph.nodes[i],context,graph.nodes[i].color,graph.nodes[i].fillColor)
        }
    }

    drawNode (node,context,color,fillColor)
    {
        if (color) {
            context.strokeStyle = color
        }
        else {
            context.strokeStyle = this.nodeColor
        }
        
        if (fillColor) {
            context.beginPath ()
            context.arc(node.position.x, node.position.y, this.nodeRadius, 0, 2 * Math.PI);
            context.fillStyle = fillColor;
            context.fill()
        }

        context.beginPath ()
        context.arc(node.position.x, node.position.y, this.nodeRadius, 0, 2 * Math.PI);   
        context.stroke()
        context.moveTo (node.position.x,node.position.y)
        context.font = this.nodeFont
        context.fillStyle = color || node.color
        context.fillText(node.id, node.position.x-12, node.position.y+5);
        context.stroke()
    }

    drawAllEdges (graph,context) 
    {
        for (var i = 0;i < graph.size;i++) {
            let startNode = graph.nodes [i]
            graph.adjList[i].forEach (
                adj_node => {
                    this.drawEdge (startNode,adj_node,context,this.edgeColor,graph.directed)
                }
            )    
        }
    }

    drawEdge (startNode,endNode,context,color,directed,lw)
    {
        let rel_pos_vector = endNode.position.substract (startNode.position)
        let dir = rel_pos_vector.unit ()
        let start_pos = startNode.position.add (dir.multiply (this.nodeRadius))
        let end_pos = startNode.position.add (rel_pos_vector.substract (dir.multiply (this.nodeRadius)))

        if (color) {
            context.strokeStyle = color
        }
        else {
            context.strokeStyle = this.defaultColor
        }

        context.lineWidth = lw || 1;

        context.beginPath ()
        context.moveTo (start_pos.x,start_pos.y)
        context.lineTo (end_pos.x,end_pos.y)
        context.stroke ()
        
        if (directed) {
            let arrow_start1 = end_pos.substract (dir.multiply (10)).add (dir.getUnitNormalCCW ().multiply (10))
            let arrow_start2 = end_pos.substract (dir.multiply (10)).add (dir.getUnitNormalCW ().multiply (10))
            context.beginPath ()
            context.moveTo (arrow_start1.x,arrow_start1.y)
            context.lineTo (end_pos.x,end_pos.y)
            context.moveTo (arrow_start2.x,arrow_start2.y)
            context.lineTo (end_pos.x,end_pos.y)
            context.stroke ()
        }
        context.lineWidth = 1;
    }

}

export {GraphPrinter}