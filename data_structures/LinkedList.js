class LinkedList
{
    constructor ()
    {
        this.head = null
        this.size = 0
    }

    add (data)
    {
        if (this.has (data))
            return
        var e = new ListElement (data)  
        if (this.size == 0) {
            this.head = e 
        } else {
            var cur_el = this.head
            while (cur_el.next) {
                cur_el = cur_el.next
            }
            cur_el.next = e 
        } 

        this.size++
        return e.data
    }

    delete (data)
    {
        if (this.size == 0) 
            return -1
        else if (this.size == 1) {
            if (this.head.data == data) {
                this.head = null
                this.size-- 
            }   
        }
        else {
            var cur_el = this.head
            var prev_el
            while (cur_el) {
                if (cur_el.data == data) {
                    if (!prev_el) {
                        this.head = cur_el.next
                    }
                    else {
                        prev_el.next = cur_el.next
                    }

                    this.size--
                    return 0
                }
                prev_el = cur_el
                cur_el = cur_el.next
            }

            return -1
        }  
    }

    has (data)
    {
        var cur_el = this.head
        while (cur_el) {
            if (cur_el.data == data) {
                return true
            }
            cur_el = cur_el.next
        }

        return false
    }

    forEach (callback)
    {
        let cur_el = this.head
        while (cur_el) {
            callback (cur_el.data)
            cur_el = cur_el.next
        }
    }

    clear ()
    {
        this.head = null
        this.size = 0
    }

}

class ListElement
{
    constructor (data)
    {
        this.data = data
        this.next = null
    }
}

export {LinkedList}