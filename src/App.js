import * as React from "react"
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom"
import Box from "@mui/material/Box"
import Table from "./components/Table"
import Searchbar from "./components/Searchbar"
import Login from "./components/Login"


const auth = () => {
  if (localStorage.getItem("react-demo-token")) {
    return true
  } else {
    return false
  }
}

function App(props) {
  const [search, setSearch] = React.useState("")
  const [searchVisible, setSearchVisible] = React.useState(true)
  const [editItem, setEditItem] = React.useState(false)

  return (
    <Router>
      <Box sx={{ width: "100%" }}>
        <Searchbar
          setSearch={setSearch}
          editItem={editItem}
          searchVisible={searchVisible}
        />
      </Box>
      <Routes>
        <Route path='/' element={<Login setSearchVisible={setSearchVisible} />} />
        <Route path='/products' element={auth() ? <Table component={Table} search={search} editItem={editItem}  setEditItem={setEditItem} setSearchVisible={setSearchVisible} /> :<Navigate to='/' />} />
      </Routes>
     
    </Router>
  )
}
export default App;