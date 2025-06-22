import React, { useState, useEffect } from 'react'

const App = () => {
  const [items, setItems] = useState([]);
  const [ivalue, setIValue] = useState("");
  const [pvalue, setPValue] = useState("");
  const [dvalue, setDValue] = useState("");
  const [nvalue, setNValue] = useState("");

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
       setItems( json );
       window.location.reload();
    })
  }

  return (
    <>
    <div className="App">
        <nav>
          <a className="nava" href="/spendinglist.html">Go to List</a>
          <a className="nava" href="/logout">Logout</a>
        </nav>

        <h1 className="col-lg-6 offset-lg-4">Add an Item</h1>
        <div data-mdb-input-init className="form-outline mb-4">
            <label htmlFor="item">Name of item:</label>
            <input type="text" id="item" value={ivalue} className="form-control w-50" onChange={(e) => setIValue(e.target.ivalue)} />
        </div>
        <br />

        <div data-mdb-input-init className="form-outline mb-4">
            <label htmlFor="price">Price paid for item (only input numbers and a '.', no '$'):</label>
            <input type="text" id="price" value={pvalue} className="form-control w-50" onChange={(e) => setPValue(e.target.pvalue)} />
        </div>
        <br />

        <div data-mdb-input-init className="form-outline mb-4">
            <label htmlFor="discount">Any discount? (put in number from 1-100 terms of %)</label>
            <input type="text" id="discount" value={dvalue} className="form-control w-50" onChange={(e) => setDValue(e.target.dvalue)} />
        </div>
        <br />

        <div data-mdb-input-init className="form-outline mb-4">
            <label htmlFor="category">Choose a category:</label>
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
            <label htmlFor="note">Any notes:</label>
            <input type="text" id="note" value={nvalue} className="form-control w-50" onChange={(e) => setNValue(e.target.nvalue)} />
        </div>
        <br />
        <button id="sending" data-mdb-button-init data-mdb-ripple-init className="btn btn-primary btn-block mb-4" onClick={ e => add()}>Submit</button>
    </div>
    </>
  )
}

export default App