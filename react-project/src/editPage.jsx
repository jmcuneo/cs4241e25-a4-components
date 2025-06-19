import React, { useState, useEffect } from 'react'

/* const Todo = props => (
  <li>{props.name} : 
    <input type="checkbox" defaultChecked={props.completed} onChange={ e => props.onclick( props.name, e.target.checked ) }/>
  </li>
) */


const EditPage = () => {
  const [todos, setTodos] = useState([ ]) 
  /* function toggle( name, completed ) {
    fetch( '/change', {
      method:'POST',
      body: JSON.stringify({ name, completed }),
      headers: { 'Content-Type': 'application/json' }
    })
  } */

  function add() {
    const item = document.querySelector( "#item" ),
          price = document.querySelector( "#price" ),
          discount = document.querySelector( "#discount" ),
          category = document.querySelector( "#category" ),
          note = document.querySelector( "#note" ),
          json = { "item": item.value, "price": price.value, "discount": discount.value, "category": category.value, "note": note.value }

    fetch( '/add', {
      method:'POST',
      body: JSON.stringify( json ),
      headers: { 'Content-Type': 'application/json' }
    })
    .then( response => {
        if (response.status === 200) {
            alert("Item was successfully added!");
          } else {
            alert("Oops, something went wrong!");
          }
    } )
    .then( json => {
       setTodos( json )
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
  }) */

  return (
    <div className="App">
        <nav>
            <a className="nava" href="/index">Add Item to List</a>
            <a className="nava" href="/spending-list">Go to List</a>
            <a className="nava" href="/logout">Logout</a>
        </nav>

        <h1 className="col-lg-6 offset-lg-4">Add an Item</h1>
        <div data-mdb-input-init className="form-outline mb-4">
            <label for="item">Name of item:</label>
            <input type="text" id="item" value="" className="form-control w-50" />
        </div>
        <br />

        <div data-mdb-input-init className="form-outline mb-4">
            <label for="price">Price paid for item (only input numbers and a '.', no '$'):</label>
            <input type="text" id="price" className="form-control w-50" />
        </div>
        <br />

        <div data-mdb-input-init className="form-outline mb-4">
            <label for="discount">Any discount? (put in number from 1-100 terms of %)</label>
            <input type="text" id="discount" value="0" className="form-control w-50" />
        </div>
        <br />

        <div data-mdb-input-init className="form-outline mb-4">
            <label for="category">Choose a category:</label>
            <select id="category" name="categories">
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
            <label for="note">Any notes:</label>
            <input type="text" id="note" className="form-control w-50" />
        </div>
        <br />
        <button id="sending" data-mdb-button-init data-mdb-ripple-init className="btn btn-primary btn-block mb-4" onClick={ e => add()}>Submit</button>
    </div>
  )
}

export default EditPage