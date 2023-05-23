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

const Enter = ({ component: Component, ...table }) => {
  const gettoken = !!localStorage.getItem("react-demo-token")
  return gettoken ? <Component {...table} /> : <Navigate to='/' />
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
        <Route
          path='/products'
          element={
            <Enter
              component={Table}
              search={search}
              editItem={editItem}
              setEditItem={setEditItem}
              setSearchVisible={setSearchVisible}
            />
          }
        />
        <Route
          path='/'
          element={<Login setSearchVisible={setSearchVisible} />}
        />
      </Routes>
    </Router>
  )
}
export default App;