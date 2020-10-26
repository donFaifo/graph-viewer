import {Vector2D} from './data_structures/Vector2D.js'

class CanvasController
{
    constructor ()
    {
        this.state = ''
        this.stateChangeListeners = []
    }

    addOnStateChangeListener (l)
    {
        this.stateChangeListeners.push (l)
    }

    notifyStateChangeListeners ()
    {

        this.stateChangeListeners.forEach (l => l (this.state))
    }

    setState (newState)
    {
        this.state = newState
        this.notifyStateChangeListeners ()
    }

    getCanvasEventCoordinates (e)
    {
        if (!this.view) 
            throw new Error('Controller has null "view" property')
        else {
            const rect = this.view.canvas.getBoundingClientRect();
            return new Vector2D (e.pageX - rect.left - scrollX,e.pageY - rect.top - scrollY)
        }
    }

    replaceThisViewCanvas ()
    {
        if (!this.view) 
            throw new Error('Controller has null "view" property')
        else {
            var newCanvas = this.view.canvas.cloneNode (true)
            this.view.canvas.replaceWith (newCanvas)
            this.view.canvas = newCanvas
            this.view.canvas.oncontextmenu = function () {return false}
        }
    }

    start (view)
    {
        throw new Error('start method is no implemented in child Controller class !!!')
    }

    stop ()
    {
        throw new Error('stop method is no implemented in child Controller class !!!')
    }

    getInfo ()
    {
        throw new Error('showInfo method is no implemented in child Controller class !!!')
    }
}

export {CanvasController}