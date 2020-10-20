
class Stepper
{
    constructor (speed)
    {
        this.speed = speed || 1000
        this.currentStep
        this.onFinish
    }

    walk (stepFunction, conditionFunction, onFinishedFunction)
    {
        this.onFinish = onFinishedFunction
        if (conditionFunction ()) {
            this.currentStep = setTimeout (o => {
                stepFunction ()
                this.walk (stepFunction, conditionFunction, onFinishedFunction)
            },this.speed) 
        }
        else {
            if (onFinishedFunction)
                onFinishedFunction ()
        }
    }

    stop ()
    {
        if (this.currentStep) {
            clearTimeout (this.currentStep)
            this.currentStep = null
        }  
        if (this.onFinish)
            this.onFinish ()  
    }
}
export {Stepper}