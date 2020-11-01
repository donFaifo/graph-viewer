import {Heap,Node} from './data_structures/Heap.js'
import {Vector2D} from './data_structures/Vector2D.js'

/**
 * A wraper class for Heap data structure.
 * Adds some info on each node, needed for printing nodes on canvas
 * Also sets default values like nodeRadius,edgeColor...
 * Implements print method for printing the Heap on canvas
 */
class HeapPrintable extends Heap
{
    /**
     * Constuctor
     * @param {String} name name of hte Heap
     */
    constructor (name)
    {
        super (name)
        this.nodeRadius = 12
        this.nodeWidth = 1
        this.nodeFont = "11px Arial"
        this.strokeColor = 'black'
        this.fillColor = 'white'
        this.nodeLineDash = []
        this.edgeColor = 'black'
        this.edgeWidth = 1
        this.edgeLineDash = []

        this.registerGetTopListener (this.onGetTop.bind (this))
        this.registerSwapListener (this.onSwap.bind (this))
        this.registerInsertListener (this.onInsert.bind (this))

        this.snapShots = []
    }

    setCanvas (canvas)
    {
        this.canvas = canvas
    }

    /**
     * This listener is called before the actual pop is made
     * @param {Node} top node that will be poped
     * @param {Node} last current last node
     */
    onGetTop (top,last)
    {
        //console.log ('onGetTop: ' + top.value + ',' + last.value) 

        //change colors of afected nodes and take snapshot
        last.originalFill = last.fillColor
        top.originalFill = top.fillColor
        last.fillColor = 'yellow'
        top.fillColor = 'red'
        this.makeSnapShot ()


        //set new positions and take snapshot
        last.position = top.position
        top.position = top.position.add (new Vector2D (0,-100))
        this.makeSnapShot ()

        //restore the colors
        last.fillColor = last.originalFill
        top.fillColor = top.originalFill

    }
    /**
     * Listener that is called after each swap douring floating or sinking
     * @param {Node} n1 node that will be swapped with n2
     * @param {Node} n2 node that will be swapped with n1
     */
    onSwap (n1,n2)
    {
        //console.log ('onSwap: ' + n1.value + ',' + n2.value)
        n1.originalFill = n1.fillColor
        n1.fillColor = 'yellow'
        let temp = n2.position
        n2.position = n1.position
        n1.position = temp
        this.makeSnapShot ()
        n1.fillColor = n1.originalFill
    }

    /**
     * This listener is colled after the newNode is pushed to this.elements,
     * but before it's is floated to it's final position
     * @param {Node} newNode 
     */
    onInsert (newNode)
    {
        //console.log ('onInsert: ' + newNode.value)
        newNode.originalFill = newNode.fillColor
        newNode.fillColor = 'yellow'
        newNode.radius = this.nodeRadius
        newNode.width = this.nodeWidth
        newNode.strokeColor = this.strokeColor
        newNode.font = this.nodeFont
        newNode.lineDash = this.nodeLineDash
        this.setPositionForElements (this.canvas, this.getNumRows())
        this.makeSnapShot ()
    }

    /**
     * Clears this.snapShots array
     */
    resetSnapShots()
    {
        this.snapShots.length = 0
    }

    /**
     * This function makes a copy of this.elements array and stores it in this.snapShots
     */
    makeSnapShot ()
    {
        //create current snapShot
        let ss = []
        this.elements.forEach (e => {
            if (!e) {
                ss.push (null) 
            }
            else { 
                ss.push (this.copyElement (e))
            } 
        })
        this.snapShots.push (ss)
    }

    copyElement (e)
    {
        let nn = new Node ()
        for (let p in e) {
            
            if (p == "position") {
                nn[p] = new Vector2D (e.position.x,e.position.y)
            }
            else if (p == 'lineDash') {
                nn[p] = []
                e[p].forEach (v => nn[p].push (v))
            }  
            else 
                nn[p] = e[p]
        }
        return nn
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
     * Override of the Heap class method.
     * It sets some aditional values for printing the node
     * @param {String or Number} value Node value
     * @param {Number} radius Radius of the circle that will be printed on canvas
     * @param {String} strokeColor color of the circle edges and text
     * @param {String} fillColor color for filling the circle
     * @param {String} font String like '<Number>px <font name>' defining font for text inside circle
     */
    insert (value,canvas,radius,width,strokeColor,fillColor,font,lineDash)
    {
        //reset snapShots
        this.resetSnapShots()
        
        //expand if needed. The check is done inside this.expand, and also snapShot is taken
        this.expand (canvas)

        let newNode = super.insert (value)
        newNode.radius = radius || this.nodeRadius
        newNode.width = width || this.nodeWidth
        newNode.strokeColor = strokeColor || this.strokeColor
        newNode.fillColor = fillColor || this.fillColor
        newNode.font = font || this.nodeFont
        newNode.lineDash = lineDash || this.nodeLineDash

        //make final snapShot
        this.setPositionForElements (canvas,this.getNumRows ())
        this.makeSnapShot ()
    }

    /**
     * Override of the Heap.getTop
     * takes snapshots of steps taken
     * @param {canvas} canvas of the View object 
     */
    getTop (canvas)
    {
        //reset snapShots
        this.resetSnapShots()

        let topValue = super.getTop ()

        //contract if needed. The check is done inside this.contract, and also snapShot is taken
        this.contract (canvas)

        this.setPositionForElements (this.canvas, this.getNumRows())
        this.makeSnapShot ()

        return topValue
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

        this.setPositionForElements (canvas,this.getNumRows ())
        this.elements.forEach (e => {
            if (e) {
                printer.printVertex (context,e)
            }
                
        })
        this.printEdges (printer)
    }

    printEdges (printer)
    {
        for (let i = 0;i<this.getNumRows ();i++) {
            let firstIdx = Math.pow (2,i)
            for (let j=firstIdx;j<firstIdx + Math.pow (2,i);j++) {
                if (this.size >= 2*j) {
                    
                    let edge1 = {}
                    edge1.startVertex = this.elements[j]
                    edge1.endVertex = this.elements[2*j]
                    edge1.color = this.edgeColor
                    edge1.width = this.edgeWidht
                    edge1.lineDash = this.edgeLineDash
                    printer.printEdge (this.canvas.getContext ("2d"),edge1)
                }
                if (this.size >= 2*j + 1) {
                    
                    let edge2 = {}
                    edge2.startVertex = this.elements[j]
                    edge2.endVertex = this.elements[2*j + 1]
                    edge2.color = this.edgeColor
                    edge2.width = this.edgeWidht
                    edge2.lineDash = this.edgeLineDash
                    printer.printEdge (this.canvas.getContext ("2d"),edge2)
                }
                
                
            }
            
        }
    }

    expand (canvas)
    {
        let numRows = this.getNumRows ()
        if (this.size > 0 && Math.pow (2,numRows) - 1 == this.size) {
            //console.log ('expanding')
            this.setPositionForElements (canvas,this.getNumRows () + 1)
            this.makeSnapShot ()
        }
            
    }

    contract (canvas)
    {
        let numRows = this.getNumRows ()
        if (this.size > 0 && Math.pow (2,numRows-1) == this.size) {
            //console.log ('contracting')
            this.setPositionForElements (canvas,this.getNumRows () - 1)
            this.makeSnapShot ()
        }
            
    }

    setPositionForElements (canvas, numRows)
    {
        if (this.size == 0)
            return

        let horizontalSeparationUnit = this.elements[1].radius * 1.3
        let verticalSeparationUnit = this.elements[1].radius * 2
        let rowStartPos
        let startPos = new Vector2D (canvas.width / 2, verticalSeparationUnit)

        for (var row = 0;row < numRows;row++) {
            if (row == 0) {
                rowStartPos = startPos
                this.elements[1].position = startPos
                continue
            }
            
            let rowNodeSeparation = Math.pow (2,numRows-row) * horizontalSeparationUnit
            let numElementsInRow = Math.pow (2,row)
            rowStartPos = startPos.add (new Vector2D (-(rowNodeSeparation * (numElementsInRow/2 - 0.5)),verticalSeparationUnit * row))
            let firstRowIndex =  Math.pow (2,row)
            let firstNextRowIndex = Math.pow (2,row+1)
            let currentPosition = rowStartPos
            for (let elIndex = firstRowIndex;elIndex < firstNextRowIndex && elIndex <= this.size;elIndex++) {
                this.elements[elIndex].position = currentPosition
                currentPosition = currentPosition.add (new Vector2D (rowNodeSeparation,0))
            }
        }
    }

    /**
     * Get's num rows in the heap.
     * For this the sum of powers of 2 formula is used: 2^(n+1) - 1
     */
    getNumRows ()
    {
        for (var n=0;n<this.size;n++) {
            if ((Math.pow (2,n+1) - 1) >= this.size)
                return n+1
        }
    }
}

export {HeapPrintable}