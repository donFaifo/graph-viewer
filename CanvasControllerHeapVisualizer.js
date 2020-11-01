import {CanvasController} from './CanvasController.js'
import {Stepper} from './Stepper.js'

class CanvasControllerHeapVisualizer extends CanvasController
{
    constructor (printer)
    {
        super ()
        this.stepper = new Stepper (500)
        this.printer = printer
    }

    start (view, heap)
    {
        
        this.view = view
        this.context = this.view.canvas.getContext ('2d')
        this.heap = heap
        heap.setCanvas (this.view.canvas)
        this.setState (this.getReadyStateHTML ()) 
    }

    stop ()
    {
        this.stepper.stop ()
        this.setState ("Heap visualizer stopped")
    }

    getInfo ()
    {
        let cont = document.createElement ('div')
        cont.appendChild (document.createTextNode ("Heap visualizer"))
        cont.appendChild (document.createElement ('br'))
        cont.appendChild (document.createTextNode ("- Allows to visualize how elements are added and removed from the heap"))
        cont.appendChild (document.createElement ('br'))
        cont.appendChild (document.createTextNode ("- When element is added, it is added at the last position and 'floated' to the right one"))
        cont.appendChild (document.createElement ('br'))
        cont.appendChild (document.createTextNode ("- When elemnt is removed, it is removed from the top,"))
        cont.appendChild (document.createElement ('br'))
        cont.appendChild (document.createTextNode (" then the last element is asigned top position and 'sinked' to the right one")) 
        cont.appendChild (document.createElement ('br'))
    
        
        let b = document.createElement ('button')
        b.innerText = 'back'
        b.onclick = function () {this.setState (this.state)}.bind (this)
        cont.appendChild ( b)
        return cont
    }

    getReadyStateHTML ()
    {
        var t = document.createElement ('table')
        t.style.borderSpacing = '10px'
        var r1 = t.insertRow (0)
        var r2 = t.insertRow (1)
        var r3 = t.insertRow (2)
        var r4 = t.insertRow (3)
        var r5 = t.insertRow (4)
        var c1_1 = r1.insertCell(0)
        var c1_2 = r1.insertCell(1)
        var c1_3 = r1.insertCell(2)
        var c2_1 = r2.insertCell(0)
        var c2_2 = r2.insertCell(1)
        var c2_3 = r2.insertCell(2)
        var c3_1 = r3.insertCell(0)
        var c3_2 = r3.insertCell(1)
        var c3_3 = r3.insertCell(2)
        var c4_1 = r4.insertCell(0)
        var c4_2 = r4.insertCell(1)
        var c4_3 = r4.insertCell(2)


        c1_2.appendChild (document.createTextNode ("Heap visualizer Ready."))
        c1_3.appendChild (document.createTextNode ("Heap type: " + this.heap.type))

        c2_1.appendChild (document.createTextNode ("Insert new value: "))
        let valueInput = document.createElement ('input')
        valueInput.type = 'text'
        c2_2.appendChild (valueInput)
        let insert = document.createElement ('button')
        insert.innerText = 'Insert'
        insert.onclick = function () {
            this.insertNewValue (parseInt (valueInput.value))
            valueInput.value = null
        }.bind (this)
        c2_2.appendChild (insert)

        c3_1.appendChild (document.createTextNode ("Get top value: "))
        let getTop = document.createElement ('button')
        getTop.innerText = 'Get top'
        getTop.onclick = function () {
            topValueInput.value = this.getTopValue ()
        }.bind (this)
        c3_1.appendChild (getTop)
        c3_2.appendChild (document.createTextNode ("value returned: "))
        let topValueInput = document.createElement ('input')
        topValueInput.type = 'text'
        topValueInput.disabled = true
        c3_2.appendChild (topValueInput)
        
        c4_1.appendChild (document.createTextNode ("Heap vector: "))
        this.heap.registerChangeListener (function (elements) {
            c4_2.innerHTML = '['
            elements.forEach (function (e,idx,elements) {
                if (idx != 0) {
                    c4_2.innerHTML += e.value
                    if (idx < elements.length - 1)
                        c4_2.innerHTML += ','
                }
            })
            c4_2.innerHTML += ']'
        })

        return t
    }

    insertNewValue (value)
    {
        this.heap.insert (value,this.view.canvas)
        this.processSnapshots ()
        //this.heap.print (this.printer,this.view.canvas)
    }

    getTopValue ()
    {
        let top = this.heap.getTop (this.view.canvas)
        this.processSnapshots ()
        //this.heap.print (this.printer,this.view.canvas)
        return top
    }

    processSnapshots ()
    {
        let current_idx = 0
        this.stepper.walk (function () {
            
            this.printSnapshot (this.heap.snapShots[current_idx])
            if (current_idx < this.heap.snapShots.length - 1)
                this.animateTransition (this.heap.snapShots[current_idx],this.heap.snapShots[current_idx+1])
            current_idx++
        }.bind (this),function () {
            return current_idx < this.heap.snapShots.length
        }.bind (this),function () {
            console.log ('finished')
            this.heap.print (this.printer,this.view.canvas)
        }.bind (this))
    }

    printSnapshot (s) {
        this.context.clearRect (0,0,this.view.canvas.width,this.view.canvas.height)
        s.forEach (n => {
            if (n != null) {
                this.printer.printVertex (this.context,n)
            }
                
        })
        this.heap.printEdges (this.printer)
    }

    //animations for snapshot change
    animateTransition (ss1,ss2)
    {
        ss1.forEach (vertex1 => {
            if (!vertex1) 
                return
            ss2.forEach (vertex2 => {
                if (vertex2 && vertex2.id == vertex1.id && vertex2.position != vertex1.position) {
                    let path = vertex2.position.substract (vertex1.position)
                    let distance = path.len ()
                    let stepDir = path.unit ()
                    let stepSize = distance / 4
                    let stepNum = 0
                    let trans = new Stepper (100)
                    trans.walk (function () {
                        vertex1.position = vertex1.position.add (stepDir.multiply (stepSize))
                        this.context.clearRect (0,0,this.view.canvas.width,this.view.canvas.height)
                        this.printSnapshot (ss1)
                        stepNum++
                    }.bind (this),function () {
                        return stepNum<4
                    },null)

                }
            })
        })
    }
    
}

export {CanvasControllerHeapVisualizer}