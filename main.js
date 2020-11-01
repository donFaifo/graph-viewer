import {View} from './View.js'
import {Model} from './Model.js'
import {CanvasControllerGraphEditor} from './CanvasControllerGraphEditor.js'
import {CanvasControllerNodeIndexer} from './CanvasControllerNodeIndexer.js'
import {CanvasControllerPathTracer} from './CanvasControllerPathTracer.js'
import {GraphPrinter} from './GraphPrinter.js'
import {Printer} from './Printer.js'
import {DFSr} from './algorithms/DFSr.js'
import {DFSi} from './algorithms/DFSi.js'
import {BFS} from './algorithms/BFS.js'
import {Kahn} from "./algorithms/Kahn.js";

window.addEventListener('load',function(){
    var m = new Model ()
    var v = new View (m)
    var gp = new GraphPrinter ()
    var ge = new CanvasControllerGraphEditor (new Printer ())
    var ni = new CanvasControllerNodeIndexer (new Printer ())
    var pt = new CanvasControllerPathTracer (new Printer ())

    var OnStateChangeListener = v.setControllerStateDisplayText.bind (v)

    ge.addOnStateChangeListener (OnStateChangeListener)
    ni.addOnStateChangeListener (OnStateChangeListener)
    pt.addOnStateChangeListener (OnStateChangeListener)
    var active_controller

    v.setup (document.getElementById ('canvas'))


    v.addNewControlButton ('New Graph',function () {
        console.log ('creating new graph')
        var text =document.createTextNode("Enter name for the new graph: ")


        var name = document.createElement ('input')
        name.value = 'graph_' + m.graphs.length
        //name.style.marginLeft = '20px'


        var b = document.createElement ('button')
        b.innerText = 'Create'
        b.onclick = function () {
            m.newGraph ( name.value)
            m.selectedGraph.directed = directed.checked
            m.selectedGraph.weighted = weighted.checked
            setActiveController (ge)
            ge.start (v,m.selectedGraph)
        }

        var text2 = document.createTextNode("Click on checkbox for directed graph: ")
        var directed = document.createElement("input")
        directed.setAttribute("type", "checkbox")

        var text3 = document.createTextNode("Click on checkbox for weighted graph: ")
        var weighted = document.createElement("input")
        weighted.setAttribute("type", "checkbox")

        var t = document.createElement ('table')
        t.style.color = v.ControllerStateDisplay.style.color
        t.style.borderSpacing = '10px'
        var r1 = t.insertRow (0)
        var r2 = t.insertRow (1)
        var r3 = t.insertRow (2)
        var r4 = t.insertRow (3)
        var c1_1 = r1.insertCell(0)
        var c1_2 = r1.insertCell(1)
        var c2_1 = r2.insertCell(0)
        var c2_2 = r2.insertCell(1)
        var c3_1 = r3.insertCell(0)
        var c3_2 = r3.insertCell(1)
        var c4_1 = r4.insertCell(0)
        var c4_2 = r4.insertCell(1)
        c1_1.appendChild (text)
        c1_2.appendChild (name)
        c2_1.appendChild (text2)
        c2_2.appendChild (directed)
        c3_1.appendChild (text3)
        c3_2.appendChild (weighted)
        c4_2.appendChild (b)

        v.setControllerStateDisplayText (t)
    })

    //
    v.addNewControlButton ('Edit Current Graph',function () {
        console.log ('Starting graph editor')
        if (!m.selectedGraph) {
            v.setControllerStateDisplayText ('No graph selected')
            return
        }
        setActiveController (ge)
        ge.start (v,m.selectedGraph)
    })

    v.addNewControlButton ('Load Graph',function () {
        console.log ('Loading graph')
        var cont = document.createElement ('div')
        var text =document.createTextNode("Select graph: ");
        cont.appendChild (text)

        var sel = document.createElement("select")
        m.graphs.forEach (g => {
            let opt = document.createElement ('option')
            opt.appendChild ( document.createTextNode (g.name))
            sel.appendChild (opt)
        })
        sel.style.marginLeft = '20px'
        cont.appendChild (sel)

        var b = document.createElement ('button')
        b.innerText = 'Load'
        b.onclick = function () {
            if (sel.selectedIndex == -1)
                    return

            m.loadGraph (sel.selectedIndex)
            setActiveController (ge)
            ge.start (v,m.selectedGraph)
        }
        cont.appendChild (b)
        v.setControllerStateDisplayText (cont)
    })

    v.addNewControlButton ('Reset Graph',function () {
        if (!m.selectedGraph) {
            v.setControllerStateDisplayText ('No graph selected')
            return
        }
        m.selectedGraph.clear ()
        setActiveController (ge)
        ge.start (v,m.selectedGraph)
    })

    v.addNewAlgorithmButton ('DFS recursive', function () {
        if (!m.selectedGraph) {
            v.setControllerStateDisplayText ('No graph selected')
            return
        }
        setActiveController (ni)
        ni.start (v,m.selectedGraph,new DFSr ('DFS recursive'))
    })

    v.addNewAlgorithmButton ('DFS iterative', function () {
        if (!m.selectedGraph) {
            v.setControllerStateDisplayText ('No graph selected')
            return
        }
        setActiveController (ni)
        ni.start (v,m.selectedGraph,new DFSi ("DFS iterative"))
    })

    v.addNewAlgorithmButton ('BFS', function () {
        if (!m.selectedGraph) {
            v.setControllerStateDisplayText ('No graph selected')
            return
        }
        setActiveController (ni)
        ni.start (v,m.selectedGraph,new BFS ("BFS"))
    })

    v.addNewAlgorithmButton ('Spanning tree with DFS', function () {
        if (!m.selectedGraph) {
            v.setControllerStateDisplayText ('No graph selected')
            return
        }
        setActiveController (pt)
        pt.start (v,m.selectedGraph,new DFSr ("DFS"))
    })

    v.addNewAlgorithmButton ('Spanning tree with BFS', function () {
        if (!m.selectedGraph) {
            v.setControllerStateDisplayText ('No graph selected')
            return
        }
        setActiveController (pt)
        pt.start (v,m.selectedGraph,new BFS ("BFS"))
    })

    v.addNewAlgorithmButton ('Kahn Algorithm', function () {
        if (!m.selectedGraph) {
            v.setControllerStateDisplayText ('No graph selected')
            return
        }
        if (!m.selectedGraph.directed || ge.graphInfo.hasCycles) {
            v.setControllerStateDisplayText ('The graph must be a directed acyclic graph')
        } else {
            setActiveController(ni)
            ni.start (v,m.selectedGraph,new Kahn("Kahn"))
        }
    })

    function setActiveController (ctrl)
    {
        if (active_controller) {
            active_controller.stop ()
        }  
        active_controller = ctrl
        v.ControllerStateDisplayInfoButton.onclick = function () {
            v.setControllerStateDisplayText (active_controller.getInfo ())
        }
    }
})

