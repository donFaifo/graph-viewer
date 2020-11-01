class Printer
{
    printVertex (context,vertex)
    {
        context.beginPath ()
        context.fillStyle = vertex.fillColor
        context.arc(vertex.position.x, vertex.position.y, vertex.radius, 0, 2 * Math.PI);
        context.fill()

        context.beginPath ()
        context.strokeStyle = vertex.strokeColor
        context.lineWidth = vertex.width
        context.setLineDash (vertex.lineDash)
        context.arc(vertex.position.x, vertex.position.y, vertex.radius, 0, 2 * Math.PI) 
        context.stroke()

        context.moveTo (vertex.position.x,vertex.position.y)
        context.font = vertex.font
        context.fillStyle = vertex.strokeColor
        let text = vertex.value ? vertex.value.toString () : vertex.id.toString ()
        let len = text.length
        context.fillText(text, vertex.position.x-parseInt (vertex.font) * len/3, vertex.position.y+5)
        context.stroke() 
    }

    printEdge (context,edge,drawWeights)
    {
        let rel_pos_vector = edge.endVertex.position.substract (edge.startVertex.position)
        let dir = rel_pos_vector.unit ()
        let start_pos = edge.startVertex.position.add (dir.multiply (edge.startVertex.radius))
        let end_pos = edge.startVertex.position.add (rel_pos_vector.substract (dir.multiply (edge.endVertex.radius)))

        context.beginPath ()
        context.strokeStyle = edge.color
        context.lineWidth = edge.width
        context.setLineDash (edge.lineDash)
        context.moveTo (start_pos.x,start_pos.y)
        context.lineTo (end_pos.x,end_pos.y)
        context.stroke ()

        if (edge.directed) {
            let arrow_start1 = end_pos.substract (dir.multiply (10)).add (dir.getUnitNormalCCW ().multiply (10))
            let arrow_start2 = end_pos.substract (dir.multiply (10)).add (dir.getUnitNormalCW ().multiply (10))
            context.beginPath ()
            context.moveTo (arrow_start1.x,arrow_start1.y)
            context.lineTo (end_pos.x,end_pos.y)
            context.moveTo (arrow_start2.x,arrow_start2.y)
            context.lineTo (end_pos.x,end_pos.y)
            context.stroke ()
        }

        if (drawWeights) {

            let con_start_pos = edge.startVertex.position.add(dir.multiply (rel_pos_vector.len ()/2))
            let con_end_pos = con_start_pos.add (dir.getUnitNormalCW ().multiply (10))
            context.beginPath ()
            context.moveTo (con_start_pos.x,con_start_pos.y)
            context.setLineDash([1, 2])
            context.lineWidth = 1
            context.lineTo (con_end_pos.x,con_end_pos.y)
            context.stroke ()
            

            edge.weightPosition = con_end_pos.add (dir.getUnitNormalCW ().multiply (10))
            context.beginPath ()
            context.arc(edge.weightPosition.x ,edge.weightPosition.y , 10, 0, 2 * Math.PI)
            context.stroke ()

            context.font = "10px Arial"
            context.fillStyle = 'blue'
            context.fillText(edge.weight, edge.weightPosition.x - 3,edge.weightPosition.y + 3)
            context.stroke()
        }
    }
}

export {Printer}