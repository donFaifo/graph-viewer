class GraphPrinter
{
    constructor ()
    {
        this.nodeRadius = 20
        this.nodeFont = "15px Arial"
        this.nodeColor = 'black'
        this.edgeColor = 'black'
        this.edgeWeightDistance = 10
        this.edgeWeightFont = "10px Arial"
        this.edgeWeightRadius = 10
    }
    drawGraph (graph, canvas)
    {
        var context = canvas.getContext ("2d")
        context.clearRect (0,0,canvas.width,canvas.height)

        this.drawAllNodes (graph,context)
        this.lastDrawedEdges = []
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
        context.arc(node.position.x, node.position.y, this.nodeRadius, 0, 2 * Math.PI) 
        context.stroke()
        context.moveTo (node.position.x,node.position.y)
        context.font = this.nodeFont
        context.fillStyle = color || node.color
        context.fillText(node.id, node.position.x-12, node.position.y+5)
        context.stroke()
    }

    drawAllEdges (graph,context) 
    {
        if (!graph.directed) {
            this.drawAllEdgesUndirected (graph,context) 
        }
        else {
            for (var i = 0;i < graph.size;i++) {
                let startNode = graph.nodes [i]
                graph.adjList[i].forEach (
                    adj_node => {
                        if (graph.weighted) {
                            var weight = graph.insMatrix.get (graph.nodes.indexOf (startNode),graph.nodes.indexOf (adj_node)) 
                        }
                        this.drawEdge (startNode,adj_node,context,this.edgeColor,graph.directed,undefined,weight) 
                    }
                )    
            }
        }
        
    }

    drawAllEdgesUndirected (graph,context) 
    {
        for (var i = 0;i < graph.size;i++) {
            for (var j = i;j < graph.size;j++) {
                let weight = graph.insMatrix.get (i,j)
                if (weight == 0)
                    continue
                if (graph.weighted)
                    this.drawEdge (graph.nodes[i],graph.nodes[j],context,this.edgeColor,graph.directed,undefined,weight) 
                else
                    this.drawEdge (graph.nodes[i],graph.nodes[j],context,this.edgeColor,graph.directed) 
            }
        }
    }

    drawEdge (startNode,endNode,context,color,directed,lw,weight)
    {
        let edge = {}
        edge.start_node = startNode
        edge.end_node = endNode
        this.lastDrawedEdges.push (edge)

        edge.rel_pos_vector = endNode.position.substract (startNode.position)
        edge.dir = edge.rel_pos_vector.unit ()
        edge.start_pos = startNode.position.add (edge.dir.multiply (this.nodeRadius))
        edge.end_pos = startNode.position.add (edge.rel_pos_vector.substract (edge.dir.multiply (this.nodeRadius)))

        if (color) {
            context.strokeStyle = color
        }
        else {
            context.strokeStyle = this.defaultColor
        }

        context.lineWidth = lw || 1;

        context.beginPath ()
        context.moveTo (edge.start_pos.x,edge.start_pos.y)
        context.lineTo (edge.end_pos.x,edge.end_pos.y)
        context.stroke ()
        
        //if directed, draw arrow
        if (directed) {
            let arrow_start1 = edge.end_pos.substract (edge.dir.multiply (10)).add (edge.dir.getUnitNormalCCW ().multiply (10))
            let arrow_start2 = edge.end_pos.substract (edge.dir.multiply (10)).add (edge.dir.getUnitNormalCW ().multiply (10))
            context.beginPath ()
            context.moveTo (arrow_start1.x,arrow_start1.y)
            context.lineTo (edge.end_pos.x,edge.end_pos.y)
            context.moveTo (arrow_start2.x,arrow_start2.y)
            context.lineTo (edge.end_pos.x,edge.end_pos.y)
            context.stroke ()
        }

        //draw edge weight
        if (weight) {

            edge.weight = weight
            //let con_start_pos = startNode.position.add (dir.multiply (this.nodeRadius + this.edgeWeightDistance*2))
            let con_start_pos = startNode.position.add(edge.dir.multiply (edge.rel_pos_vector.len ()/2))
            let con_end_pos = con_start_pos.add (edge.dir.getUnitNormalCW ().multiply (this.edgeWeightDistance))
            context.beginPath ()
            context.moveTo (con_start_pos.x,con_start_pos.y)
            context.setLineDash([1, 2])
            context.lineTo (con_end_pos.x,con_end_pos.y)
            context.stroke ()
            

            edge.weight_center = con_end_pos.add (edge.dir.getUnitNormalCW ().multiply (this.edgeWeightRadius))
            context.beginPath ()
            context.setLineDash([1, 2])
            context.arc(edge.weight_center.x ,edge.weight_center.y , this.edgeWeightRadius, 0, 2 * Math.PI)
            context.stroke ()
            context.setLineDash([])

            context.font = this.edgeWeightFont
            var old_fs = context.fillStyle
            context.fillStyle = 'blue'
            context.fillText(weight, edge.weight_center.x - 3,edge.weight_center.y + 3)
            context.stroke()
            context.fillStyle = old_fs
        }
        context.lineWidth = 1
    }

}

export {GraphPrinter}