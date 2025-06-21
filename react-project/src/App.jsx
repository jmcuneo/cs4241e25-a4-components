import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IndexPage from './indexPage.jsx';
import EditPage from './editPage.jsx'
import SpendingList from './spendingList.jsx'

/* const Todo = props => (
  <li>{props.name} : 
    <input type="checkbox" defaultChecked={props.completed} onChange={ e => props.onclick( props.name, e.target.checked ) }/>
  </li>
) */


const App = () => {
  const [items, setItems] = useState([]);
  const [ivalue, setIValue] = useState("");
  const [pvalue, setPValue] = useState("");
  const [dvalue, setDValue] = useState("");
  const [nvalue, setNValue] = useState("");
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
       setItems( json );
       window.location.reload();
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
    <>
      <Router>
        <Routes>IndexPage
          <Route path="/index" element={<IndexPage />} />
          <Route path="/spending-list" element={<SpendingList />} />
          <Route path="/edit" element={<EditPage />} />
          {/* Add more routes for other pages */}
        </Routes>
      </Router>
    </>
  )
}

export default App