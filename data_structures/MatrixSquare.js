class MatrixSquare
{
    constructor ()
    {
        this.rows = []
        this.size = 0
    }

    expand ()
    {
        
        this.rows.push (new Array (this.size).fill (0))
        for (var i = 0;i < this.size + 1;i++) {
            this.rows[i].push (0)
        }
        this.size++
    }

    shrink (num_row)
    {
        for (var i = 0;i < this.size;i++) {
            this.rows[i].splice (num_row != null ? num_row : this.size-1,1)
        }
        num_row != null ? this.rows.splice (num_row,1) : this.rows.splice (this.size-1,1)

        this.size--
    }

    get (r,c)
    {
        return this.rows[r][c]
    }

    set (r,c,value)
    {
        this.rows[r][c] = value
    }

    clear ()
    {
        this.rows.length = 0
        this.size = 0
    }
}

export {MatrixSquare}