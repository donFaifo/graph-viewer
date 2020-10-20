import {View} from './View.js'
import {Model} from './Model.js'
import {CanvasControllerGraphEditor} from './CanvasControllerGraphEditor.js'
import {CanvasControllerNodeIndexer} from './CanvasControllerNodeIndexer.js'
import {CanvasControllerPathTracer} from './CanvasControllerPathTracer.js'
import {GraphPrinter} from './GraphPrinter.js'
import {DFSr} from './algorithms/DFSr.js'
import {DFSi} from './algorithms/DFSi.js'
import {BFS} from './algorithms/BFS.js'

window.addEventListener('load',function(){
    var m = new Model ()
    var v = new View (m)
    var gp = new GraphPrinter ()
    var ge = new CanvasControllerGraphEditor (gp)
    var ni = new CanvasControllerNodeIndexer (gp)
    var pt = new CanvasControllerPathTracer (gp)
    ge.addOnStateChangeListener (state => v.ControllerStateDisplay.innerHTML = state)
    ni.addOnStateChangeListener (state => v.ControllerStateDisplay.innerHTML = state)
    pt.addOnStateChangeListener (state => v.ControllerStateDisplay.innerHTML = state)
    var active_controller

    v.setup (document.getElementById ('canvas'))
    

    v.addNewControlButton ('New Graph',function () {
        console.log ('creating new graph')
        v.ControllerStateDisplay.innerHTML = ''
        var text =document.createTextNode("Enter name for the new graph: ")
        

        var name = document.createElement ('input')
        name.value = 'graph_' + m.graphs.length
        //name.style.marginLeft = '20px'
        

        var b = document.createElement ('button')
        b.innerText = 'Create'
        b.onclick = function () {
            m.newGraph ( name.value)
            m.selectedGraph.directed = directed.checked
            setActiveController (ge)
            ge.start (v,m.selectedGraph)
        }

        var text2 = document.createTextNode("Click on checkbox for directed graph: ")
        var directed = document.createElement("input")
        directed.setAttribute("type", "checkbox")
        
        var t = document.createElement ('table')
        t.style.color = v.ControllerStateDisplay.style.color
        t.style.borderSpacing = '10px'
        var r1 = t.insertRow (0)
        var r2 = t.insertRow (1)
        var r3 = t.insertRow (2)
        var c1_1 = r1.insertCell(0)
        var c1_2 = r1.insertCell(1)
        var c2_1 = r2.insertCell(0)
        var c2_2 = r2.insertCell(1)
        var c3_1 = r3.insertCell(0)
        var c3_2 = r3.insertCell(1)
        c1_1.appendChild (text)
        c1_2.appendChild (name)
        c2_1.appendChild (text2)
        c2_2.appendChild (directed)
        c3_2.appendChild (b)

        v.ControllerStateDisplay.appendChild (t)
    })

    v.addNewControlButton ('Edit Current Graph',function () {
        console.log ('Starting graph editor')
        if (!m.selectedGraph) {
            v.ControllerStateDisplay.innerHTML = 'No graph selected'
            return
        }
        v.ControllerStateDisplay.innerHTML = ''
        setActiveController (ge)
        ge.start (v,m.selectedGraph)
    })

    v.addNewControlButton ('Load Graph',function () {
        console.log ('Loading graph')
        v.ControllerStateDisplay.innerHTML = ''
        var text =document.createTextNode("Select graph: ");
        v.ControllerStateDisplay.appendChild (text)
        
        var sel = document.createElement("select")
        m.graphs.forEach (g => {
            let opt = document.createElement ('option')
            opt.appendChild ( document.createTextNode (g.name))
            sel.appendChild (opt)
        })
        sel.style.marginLeft = '20px'
        v.ControllerStateDisplay.appendChild (sel)

        var b = document.createElement ('button')
        b.innerText = 'Load'
        b.onclick = function () {
            if (sel.selectedIndex == -1)
                    return
                
            m.loadGraph (sel.selectedIndex)
            setActiveController (ge)
            ge.start (v,m.selectedGraph)
        }
        v.ControllerStateDisplay.appendChild (b)
    })

    v.addNewControlButton ('Reset Graph',function () {
        if (!m.selectedGraph) {
            v.ControllerStateDisplay.innerHTML = 'No graph selected'
            return
        }
        m.selectedGraph.clear ()
        setActiveController (ge)
        ge.start (v,m.selectedGraph)
    })

    v.addNewAlgorithmButton ('DFS recursive', function () {
        if (!m.selectedGraph) {
            v.ControllerStateDisplay.innerHTML = 'No graph selected'
            return
        }     
        setActiveController (ni)
        ni.start (v,m.selectedGraph,new DFSr ('DFS recursive'))
    })

    v.addNewAlgorithmButton ('DFS iterative', function () {
        if (!m.selectedGraph) {
            v.ControllerStateDisplay.innerHTML = 'No graph selected'
            return
        }     
        setActiveController (ni)
        ni.start (v,m.selectedGraph,new DFSi ("DFS iterative"))
    })

    v.addNewAlgorithmButton ('BFS', function () {
        if (!m.selectedGraph) {
            v.ControllerStateDisplay.innerHTML = 'No graph selected'
            return
        }     
        setActiveController (ni)
        ni.start (v,m.selectedGraph,new BFS ("BFS"))
    })

    v.addNewAlgorithmButton ('Spanning tree with DFS', function () {
        if (!m.selectedGraph) {
            v.ControllerStateDisplay.innerHTML = 'No graph selected'
            return
        }     
        setActiveController (pt)
        pt.start (v,m.selectedGraph,new DFSr ("DFS"))
    })

    v.addNewAlgorithmButton ('Spanning tree with BFS', function () {
        if (!m.selectedGraph) {
            v.ControllerStateDisplay.innerHTML = 'No graph selected'
            return
        }     
        setActiveController (pt)
        pt.start (v,m.selectedGraph,new BFS ("BFS"))
    })

    function setActiveController (ctrl)
    {
        if (active_controller) 
            active_controller.stop ()
        active_controller = ctrl
    }
})
