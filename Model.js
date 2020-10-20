import {Graph} from './data_structures/Graph.js'
class Model
{
    constructor ()
    {
        this.graphs = []
        this.graphChangeListeners = []
        this.graphListeners = []
    }

    newGraph (name)
    {
        this.selectedGraph = new Graph (name)
        this.graphs.push (this.selectedGraph)
        this.graphListeners.forEach (l => this.selectedGraph.addListener (l))
        this.notifyGraphChangeListeners ()
    }

    loadGraph (graphIndex)
    {
        this.selectedGraph = this.graphs [graphIndex]
        this.notifyGraphChangeListeners ()
    }

    addGraphChangeListener (listener)
    {
        this.graphChangeListeners.push (listener)
    }

    notifyGraphChangeListeners ()
    {
        this.graphChangeListeners.forEach (l => l (this.selectedGraph))
    }

    addGraphListener (listener)
    {
        this.graphListeners.push (listener)
    }
}

export {Model}