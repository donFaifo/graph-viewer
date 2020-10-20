class View
{
    constructor (model)
    {
        this.model = model
    }

    setup (canvas)
    {
        this.createContainer ()
        this.createControls ()
        this.createGraphNameField ()
        this.createControllerStateDisplay ()
        this.createAlgorithmContainer ()
        this.moveCanvasToContainer (canvas)
    }

    createContainer ()
    {
        this.container = document.createElement ('div')
        this.container.style.display = 'grid'
        this.container.style.width = '900px'
        this.container.style.gridTemplateColumns = 'repeat(10, 1fr)'
        this.container.style.gridTemplateRows = 'repeat(10,auto)'
        this.container.style.gridGap = '1rem'
        this.container.style.backgroundColor = 'rgba(56,109,255,0.5)'

    }

    createControls ()
    {
        this.controls = document.createElement ('div')
        this.controls.style.gridRow = '1 / 2'
        this.controls.style.gridColumn = '1 / 11'
        this.container.appendChild (this.controls)
        this.container.style.paddingBottom = '3px'
    }

    createGraphNameField ()
    {
        this.gName = document.createElement ('div')
        this.gName.style.gridRow = '1 / 2'
        this.gName.style.gridColumn = '8 / 11'
        this.gName.innerHTML = 'Current Graph: ---'
        this.gName.style.display = 'flex'
        this.gName.style.justifyContent = 'center'
        this.gName.style.alignItems = 'center'
        this.gName.style.backgroundColor = 'rgb(255,255,255)'
        this.gName.style.color = 'rgb(56,109,255)'
        this.gName.style.marginTop = '-3px'
        this.gName.style.marginRight = '-3px'
        this.model.addGraphChangeListener (g => this.gName.innerHTML = 'Current Graph: &nbsp&nbsp<b> ' + g.name + '</b>')
        this.container.appendChild (this.gName)
    }

    createControllerStateDisplay ()
    {
        this.ControllerStateDisplay = document.createElement ('div')
        this.ControllerStateDisplay.style.gridRow = '2 / 3'
        this.ControllerStateDisplay.style.gridColumn = '2 / 11'
        this.ControllerStateDisplay.style.height = '110px'
        this.ControllerStateDisplay.style.overflow = 'auto'
        this.ControllerStateDisplay.style.display = 'flex'
        this.ControllerStateDisplay.style.justifyContent = 'center'
        this.ControllerStateDisplay.style.alignItems = 'center'
        this.ControllerStateDisplay.style.backgroundColor = 'rgba(255,255,255,0.8)'
        this.ControllerStateDisplay.style.color = 'rgb(56,109,255)'
        this.ControllerStateDisplay.style.padding = '20px'
        this.ControllerStateDisplay.style.borderRadius = '10px'
        this.ControllerStateDisplay.style.marginRight = '5px'
        this.container.appendChild (this.ControllerStateDisplay)
    }

    moveCanvasToContainer (canvas)
    {
        this.canvas = document.getElementById ('canvas')
        var parent = canvas.parentNode
        var nextSibling = canvas.nextSibling

        this.container.appendChild (parent.removeChild (canvas))

        parent.insertBefore (this.container,nextSibling)
        
        this.canvas.style.borderStyle = "groove";
        this.canvas.style.gridRow = '3 / 11'
        this.canvas.style.gridColumn = '3 / 11'

        this.canvas.width = '708'
        this.canvas.height = '700'
        this.canvas.style.backgroundColor = 'white'

    }

    createAlgorithmContainer ()
    {
        this.algorithmContainer = document.createElement ('div')
        this.algorithmContainer.style.gridRow = '3 / 11'
        this.algorithmContainer.style.gridColumn = '1 / 3'
        this.container.appendChild (this.algorithmContainer)
    }

    addNewControlButton (text,callback)
    {
        var ctrl = document.createElement ("button")
        ctrl.innerText = text
        ctrl.onclick = callback
        this.controls.appendChild (ctrl)
    }

    addNewAlgorithmButton (text,callback)
    {
        var alg = document.createElement ("button")
        alg.style.display = 'block'
        alg.style.width = '100%'
        alg.innerText = text
        alg.onclick = callback
        this.algorithmContainer.appendChild (alg)
    }
}

export {View}