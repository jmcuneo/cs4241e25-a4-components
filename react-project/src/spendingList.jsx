import React, { useState, useEffect } from 'react'

const Items = item => (
    <tr>
        <th>{item.date}</th>
        <th>{item.item}</th>
        <th>${item.price}</th>
        <th>{item.discount}%</th>
        <th>${item.moneySaved}</th>
        <th>{item.category}</th>
        <th>{item.note}</th>
        <th><button id="editing" data-mdb-button-init data-mdb-ripple-init className="btn btn-secondary" value={item._id} onClick={ e => item.editPage(item._id)}>Edit Item</button></th>
        <th><button id="deleting" data-mdb-button-init data-mdb-ripple-init className="btn btn-danger" value={item._id} onClick={ e => item.deleteItem(item._id)}>Delete Item</button></th>
    </tr>
)


const SpendingList = () => {
  const [allItems, setAllItems] = useState([ ]) 
  /* function toggle( name, completed ) {
    fetch( '/change', {
      method:'POST',
      body: JSON.stringify({ name, completed }),
      headers: { 'Content-Type': 'application/json' }
    })
  } */

    function editPage(idNum) {
        fetch( `edit?itemID=${idNum}`, {
            method: "GET",
        }).then( response => {
            if (response.status !== 200) {
                alert("Oops, something went wrong and the item cannot be edited!")
            } else {
                window.location.href = response.url;  
            }
        })
    }

    function deleteItem(idNum) {
        const theid = { "_id": idNum }

        fetch( "deleteItem", {
            method: "DELETE",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify( theid )
        }).then( response => {
            if (response.status === 200) {
            alert("Item deleted successfully!")
            } else {
            alert("Oops, something went wrong and the item was not deleted!")
            }
        })
        window.location.reload(true);
    }




    // fetch, calling data
    fetch( '/obtainData.json', {
        method:'GET'
    })
    .then( response => response.json())
    .then( json => {
        setAllItems(json);
    })

  // make sure to only do this once
  /* if( todos.length === 0 ) {
    fetch( '/read' )
      .then( response => response.json() )
      .then( json => {
        setTodos( json ) 
      })
  }
    
  useEffect( ()=> {
    document.title = `${todos.length} todo(s)`
  }) */

  return (
    <div className="App">
        <nav>
          <a className="nava" href="/index">Add Item to List</a>
          <a className="nava" href="/logout">Logout</a>
        </nav>

        <h1 className="col-lg-6 offset-lg-4">Spending Tracker</h1>

        <table className="table table-striped">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Item</th>
                    <th>Price Paid</th>
                    <th>Discount</th>
                    <th>Money Saved</th>
                    <th>Category</th>
                    <th>Note</th>
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody id="itemtablebody">
                {allItems.map((item, i) => <Items key={i} date={item.date} item={item.item} price={item.price} discount={item.discount} moneySaved={item.moneySaved} category={item.category} note={item.note} editFunc={editPage} deleteFunc={deleteItem} />)}
            </tbody>
        </table>
    </div>
  )
}

export default SpendingList