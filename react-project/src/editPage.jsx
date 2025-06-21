import React, { useState, useEffect } from 'react'

/* const Todo = props => (
  <li>{props.name} : 
    <input type="checkbox" defaultChecked={props.completed} onChange={ e => props.onclick( props.name, e.target.checked ) }/>
  </li>
) */


const EditPage = () => {
    const [items, setItems] = useState([ ]) 
    const [ivalue, setIValue] = useState(items.item);
    const [pvalue, setPValue] = useState("");
    const [dvalue, setDValue] = useState("");
    const [nvalue, setNValue] = useState("");
    
    const [cvalue, setCValue] = useState("");
  /* function toggle( name, completed ) {
    fetch( '/change', {
      method:'POST',
      body: JSON.stringify({ name, completed }),
      headers: { 'Content-Type': 'application/json' }
    })
  } */

  function edit() {
    const eitem = document.querySelector( "#eitem" ),
        eprice = document.querySelector( "#eprice" ),
        ediscount = document.querySelector( "#ediscount" ),
        ecategory = document.querySelector( "#ecategory" ),
        enote = document.querySelector( "#enote" ),
        json = { "item": eitem.value, "price": eprice.value, "discount": ediscount.value, "category": ecategory.value, "note": enote.value }
    console.log(json)

    fetch( '/edit', {
      method:'POST',
      body: JSON.stringify( json ),
      headers: { 'Content-Type': 'application/json' }
    })
    .then( response => {
        if (response.status === 200) {
            alert("Item was updated!");
            window.location.href = response.url;
          } else {
            alert("Oops, something went wrong!");
            window.location.reload(true);
          }
    })
  }
  
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
  }) 

  <option hidden disabled selected value> -- select an option -- </option>
  */
    if (items.length === 0) {
        fetch( `/getItem`, {
            method: "GET",
        }).then( response => {
            if (response.status !== 200) {
            alert("Oops, something went wrong!")
            }
            let receivedData = response.json()
            return receivedData
        }).then(json => {
            setItems(json);
            setIValue(json.item)
            setPValue(json.price)
            setDValue(json.discount)
            setNValue(json.note)
            setCValue(json.category)
        })
    }
    
    return (
        <div className="App">
            <nav>
                <a className="nava" href="/index">Add Item to List</a>
                <a className="nava" href="/spending-list">Go to List</a>
                <a className="nava" href="/logout">Logout</a>
            </nav>

            <h1 className="col-lg-6 offset-lg-4">Edit Item</h1>
            <form method="POST" className="col-lg-6 offset-lg-4">
            <div data-mdb-input-init className="form-outline mb-4">
                <label htmlFor="eitem">Name of item:</label>
                <input type="text" id="eitem" className="form-control w-50" value={ivalue} onChange={(e) => setIValue(e.target.ivalue)} />
            </div>
            <br />
            <div data-mdb-input-init className="form-outline mb-4">
                <label htmlFor="eprice">Price paid for item (only input numbers and a '.', no '$'):</label>
                <input type="text" id="eprice" className="form-control w-50" value={pvalue} onChange={(e) => setPValue(e.target.pvalue)} />
            </div>
            <br />
            <div data-mdb-input-init className="form-outline mb-4">
                <label htmlFor="ediscount">Any discount? (put in number from 1-100 terms of %)</label>
                <input type="text" id="ediscount" className="form-control w-50" value={dvalue} onChange={(e) => setDValue(e.target.dvalue)} />
            </div>
            <br />
            <div data-mdb-input-init className="form-outline mb-4">
                <label htmlFor="ecategory">Choose a category:</label>
                <select id="ecategory" name="categories" value={cvalue} onChange={(e) => setCValue(e.target.cvalue)}>
                    <option value="general">General</option>
                    <option value="groceries">Groceries</option>
                    <option value="bills">Bills</option>
                    <option value="shopping">Shopping</option>
                    <option value="treats">Treats for Myself</option>
                    <option value="gifts">Gifts</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <br />
            <div data-mdb-input-init className="form-outline mb-4">
                <label htmlFor="enote">Any notes:</label>
                <input type="text" id="enote" className="form-control w-50" value={nvalue} onChange={(e) => setNValue(e.target.nvalue)} />
            </div>
            <br />
            <button id="updating" data-mdb-button-init data-mdb-ripple-init className="btn btn-primary btn-block mb-4" onClick={ e => edit()}>Update</button>
            </form>
        </div>
    )
}

export default EditPage