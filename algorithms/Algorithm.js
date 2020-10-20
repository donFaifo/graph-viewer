//class from which all algorithms should be extended
class Algorithm
{
    constructor (name)
    {
        this.name = name
        this.output = {}
    }

    run ()
    {
        throw new Error('You need to implement run method')
    }

    showSource ()
    {
        throw new Error('You need to implement showSource method')
    }
}

export {Algorithm}
