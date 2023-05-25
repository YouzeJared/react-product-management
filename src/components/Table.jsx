import * as React from "react"
import DialogTitle from "@mui/material/DialogTitle"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import PropTypes from "prop-types"
import Box from "@mui/material/Box"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TablePagination from "@mui/material/TablePagination"
import TableRow from "@mui/material/TableRow"
import TableSortLabel from "@mui/material/TableSortLabel"
import Paper from "@mui/material/Paper"
import { visuallyHidden } from "@mui/utils"
import Button from "@mui/material/Button"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import CheckIcon from "@mui/icons-material/Check"
import UpgradeIcon from '@mui/icons-material/Upgrade';
import CloseIcon from "@mui/icons-material/Close"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import FileUploadIcon from '@mui/icons-material/FileUpload';
import axios from 'axios'
import { TextField } from "@mui/material"
import GetAppIcon from "@mui/icons-material/GetApp"
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import * as XLSX from "xlsx"
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

const headCells = [
  {
    id: "title",
    numeric: false,
    label: "Title",
  },
  {
    id: "description",
    numeric: false,
    label: "Description",
  },
  {
    id: "price",
    numeric: true,
    label: "Price",
  },
  {
    id: "image",
    numeric: false,
    label: "Image",
  },
  {
    id: "action",
    numeric: false,
    label: "Action",
  },
]

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={"center"}
            padding={"normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component='span' sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
}

export default function EnhancedTable({
  search,
  editItem,
  setEditItem,
  setSearchVisible,
}) {
  const [order, setOrder] = React.useState("asc")
  const [orderBy, setOrderBy] = React.useState("")
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [product, setProduct] = React.useState({
    category_id: '99',
    id: '',
    title: '',
    description: '',
    price: '',
  })
  const token = localStorage.getItem("token")
  const [currentEdit, setCurrentEdit] = React.useState("")
  const [currentDelete, setCurrentDelete] = React.useState("")
  const [addrow, setAddrow] = React.useState(false)
  const [item, setItem] = React.useState([])
  const [formData, setFormData] = React.useState([])
  const [adding, setAdding] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [opens, setOpens] = React.useState(false);
  const [snackContent, setSnackContent] = React.useState("");
  const [severity, setSeverity] = React.useState('success');
  const [downLoad, setDownLoad] = React.useState(false)

  
  //获取数据
  React.useEffect(() => {
    axios.get("https://app.spiritx.co.nz/api/products")
      .then((res) => {
        const data = res.data
        data.map((prod) => (prod.price = parseInt(prod.price)))
        setItem(data)
        setFormData(data)
        handleSuccess("Log in successfully!");
      })
      .catch((err) => {handleFail(err.message);})
    setSearchVisible(true)
  }, [])
  //搜索过滤数据
  React.useEffect(() => {
    setItem(
      formData.filter((prod) => {
        if (
          (prod.title &&
            prod.title.toLowerCase().includes(search.toLowerCase())) ||
          (prod.description &&
            prod.description.toLowerCase().includes(search.toLowerCase()))
        ) {
          return prod
        }
        if (search === "") {
          return prod
        }
      })
    )
    setPage(0)
  }, [search])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc"
    setOrder(isAsc ? "desc" : "asc")
    setOrderBy(property)
  }
  //添加按钮保存
  const handleAddClick = (e) => {
    const formData = new FormData()
    e.preventDefault()
    product.title && formData.append("title", product.title)
    product.price && formData.append("price", product.price)
    product.description && formData.append("description", product.description)
    product.image && formData.append("product_image", product.image)
    formData.append("category_id", product.category_id)
    formData.append("is_active", 0)
    axios.create({
      headers:
      {
        'token': localStorage.getItem('react-demo-token')
      }
      ,
    }).post(`https://app.spiritx.co.nz/api/products`, formData)
      .then((res) => {
        const newProducts = [res.data, ...item]
        setItem(newProducts)
        setEditItem(false)
        setAddrow(false)
        setAdding(false)
        console.log(res)
        handleSuccess("Data add successfully!");
      })
      .catch((err) => {handleFail(err.message);})
      
  }



  {/*const handleAddForSubmit = (e) => {
    let formData = new FormData()
    e.preventDefault()
    formData.append('category', 99)
    formData.append('title', addFormData.title)
    addFormData.description && formData.append(
      'description',
      addFormData.description
    )
    formData.append('price', addFormData.price)
    img && formData.append('product_image', img)

    axios.post(`product`, formData)
    .then((res) => {
      console.log(item)
      const newProduct = [res.data, ...item]
      setItem(newProduct)
      setEditItem((current) => !current)
    })
    .catch((err) => console.log(err))



  }*/}
  //编辑按钮
  const handleEditClick = (e, value) => {
    setCurrentEdit(item.find((c) => c.id === value))
    setEditItem((current) => !current)
  }
  //编辑按钮保存
  const handleEditSave = () => {
    const formData = new FormData()
    formData.append("title", product.title)
    formData.append("description", product.description)
    formData.append("price", product.price)
    console.log("img = ", product.image)
    product.image && formData.append("product_image", product.image)
    formData.append("category_id", product.category_id)
    formData.append("_method", "put")
    axios.post(`https://app.spiritx.co.nz/api/product/${currentEdit.id}`, formData)

      .then((res) => {
        console.log(item)
        const newProduct = [...item]
        const index = item.findIndex((prod) => prod.id === currentEdit.id)
        const editedProduct = { ...res.data, price: parseInt(res.data.price) }
        newProduct[index] = editedProduct
        setItem(newProduct)
        setEditItem((current) => !current)
        handleSuccess("Data edited successfully!");
      })
      .catch((err) => {handleFail(err.message);})


  }
  //取消添加
  const handleCancelAdd = () => {
    setEditItem(false)
    setAdding(false)
    setAddrow(false)
  }
  //取消编辑
  const handleCancelEdit = () => {
    setProduct((prevState) => {
      return { ...prevState, price: parseInt(prevState.price) }
    })
    setEditItem((current) => !current)
    setAdding(!adding)
    
    
  }
  //点击添加按钮
  const handleClick = () => {
    setEditItem(false)
    setAddrow(true)
    setAdding(true)
    
  }
  //删除，弹窗页面
  const handleDelete = (e, value) => {
    setOpen(true)
    setCurrentDelete(item.find((row) => row.id === value))

  };
  //取消删除，弹窗页面取消
  const handleClose = () => {
    setOpen(false)
  }
  //确认删除，弹窗页面取消，删除数据
  const handleConfirm = () => {
    setOpen(false)
    fetch(`https://app.spiritx.co.nz/api/product/${currentDelete.id}`, {
      method: 'DELETE',
      headers: {
        token: localStorage.getItem('react-demo-token')
      },
    })
      .then(() => {
        setItem(item.filter((row) => row.id !== currentDelete.id))
        handleSuccess("Data delete successfully!");
      })
      .catch((err) => {handleFail(err.message);})


  }

  const handleChange = e => {
    setProduct({ ...product, [e.target.name]: e.target.value })
  }
  const handleImgChange = e => {
    setProduct({ ...product, image: e.target.files[0] })
  }


  const handleClosebar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpens(false);
  };

  const handleSuccess = (content) => {
    setSnackContent(content);
    setOpens(true);
    setSeverity('success');
  };
  const handleFail = (content) => {
    setOpens(true);
    setSnackContent(content);
    setSeverity('error');
  };
  const handleRequestImport = (e) => {
    const uploadedFile = e.target.files[0]
    const fileReader = new FileReader()
    fileReader.readAsArrayBuffer(uploadedFile)
    fileReader.onload = (e) => {
      const bufferArray = e.target.result
      const workbook = XLSX.read(bufferArray, {
        type: 'buffer'
      })
      const data = XLSX.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[0]],
        { header: 1 }
      )
      const SliceRows = data.slice(1).map((r) =>
        r.reduce((acc, x, i) => {
          acc[data[0][i]] = x
          return acc
        }, {})
      )
      console.log(SliceRows)
      setItem(
        SliceRows.map((pro) => pro),
        ...item
      )
      handleSuccess('import-success')
    }
  }
  const handleDownload = () => {
    const sheetData = item.map((row) => [row.title, row.description, row.price])
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData)
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
    XLSX.writeFile(workbook, "luxdream.xlsx")
    handleSuccess('export-success')
  }
  


  return (
    <Box sx={{ width: "100%" }}>
      <Box>
        <IconButton color='primary' onClick={handleClick} >
          <AddCircleIcon />
        </IconButton>
        <IconButton
          color='primary'
          onClick={handleDownload}
        >
          
          <GetAppIcon />
        </IconButton>
        <IconButton
          color='primary'
          aria-label='upload excel'
          component='label'
          disabled={downLoad}
          
        >
          <input
            hidden
            type='file'
            accept='.xlsx, .xls'
            onChange={(e) => {
              handleRequestImport(e)
            }}
          />
          <FileUploadIcon />
        </IconButton>
      </Box>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle'>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={item.length}
            />
            <TableBody>
              {addrow ? (
                <TableRow>
                  <TableCell align='center'>
                    <TextField
                      placeholder='Title'
                      name='title'
                      onChange={(e) =>
                        handleChange(e)
                      }
                    />
                  </TableCell>
                  <TableCell align='center'>
                    <TextField
                      placeholder='Description'
                      name='description'
                      onChange={(e) =>
                        handleChange(e)
                      }
                    />
                  </TableCell>
                  <TableCell align='center'>
                    <TextField
                      placeholder='Price'
                      type='number'
                      name='price'
                      onChange={(e) =>
                        handleChange(e)
                      }
                    />
                  </TableCell>
                  <TableCell align='center'>
                    <IconButton
                      color='primary'
                      aria-label='upload picture'
                      component='label'
                    >
                      <input
                        hidden
                        accept='image/*'
                        type='file'
                        id='file'
                        onChange={(e) =>
                          handleImgChange(e)
                        }
                      />
                      {product.image ? (
                        <img
                          src={URL.createObjectURL(product.image)}
                          alt='Selected Image'
                          width='80'
                          height='60'
                        />
                      ) : (
                        <span><UpgradeIcon /></span>
                      )}


                    </IconButton>
                  </TableCell>
                  <TableCell align='center'>
                    <IconButton
                      color='primary'
                      variant='contained'
                      type='submit'
                      onClick={(e) => handleAddClick(e)}
                    >
                      <CheckIcon />
                    </IconButton>
                    <IconButton
                      color='primary'
                      onClick={() => handleCancelAdd()}
                    >
                      <CloseIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ) : null}
              {stableSort(item, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <React.Fragment key={row.id}>
                      {editItem && currentEdit.id === row.id ? (
                        <TableRow hover tabIndex={-1} key={row.id}>
                          <TableCell key={row.id} align='center'>
                            <TextField
                              placeholder={row.title}
                              name='title'
                              onChange={(e) =>
                                handleChange(e)
                              }
                            />
                          </TableCell>
                          <TableCell align='center'>
                            <TextField
                              placeholder={row.description}
                              name='description'
                              onChange={(e) =>
                                handleChange(e)
                              }
                            />
                          </TableCell>
                          <TableCell align='center'>
                            <TextField
                              type='number'
                              placeholder={row.price.toString()}
                              name='price'
                              onChange={(e) =>
                                handleChange(e)
                              }
                            />
                          </TableCell>
                          <TableCell align='center'>
                            <IconButton
                              color='primary'
                              aria-label='upload picture'
                              component='label'
                            >
                              <input
                                hidden
                                accept='image/*'
                                type='file'
                                name='product_image'
                                onChange={(e) =>
                                  handleImgChange(e)
                                }
                              />
                              {product.image ? (
                                <img
                                  src={URL.createObjectURL(product.image)}
                                  alt='Selected Image'
                                  width='80'
                                  height='60'
                                />
                              ) : row.image ? (
                                <img
                                  src={`https://app.spiritx.co.nz/storage/${row.product_image}`}
                                  width='80'
                                  height='60'
                                />
                              ) : (
                                <span>Edit Img</span>
                              )}
                            </IconButton>
                          </TableCell>
                          <TableCell align='center'>
                            <IconButton
                              color='primary'
                              onClick={(e) => handleEditSave()}
                            >
                              <CheckIcon />
                            </IconButton>
                            <IconButton
                              color='primary'
                              onClick={(e) => handleCancelEdit()}
                            >
                              <CloseIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ) : (
                        <React.Fragment key={row.id}>
                          <Dialog open={open} onClose={handleClose}>
                            <DialogTitle>Tips</DialogTitle>
                            <DialogContent>
                              <p>Are you sure to delete this data?</p>
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={handleClose} color='primary'>
                                Cancel
                              </Button>
                              <Button onClick={(e) => handleConfirm(e, row.id)} color='primary'>
                                Delete
                              </Button>
                            </DialogActions>
                          </Dialog>
                          <TableRow hover tabIndex={-1} key={row.id}>
                            <TableCell key={row.id} align='center'>
                              {row.title}
                            </TableCell>
                            <TableCell align='center'>
                              {row.description}
                            </TableCell>
                            <TableCell align='center' type='number'>
                              {row.price}
                            </TableCell>
                            <TableCell align="center">{row.product_image ? (
                              <img
                                src={`https://app.spiritx.co.nz/storage/${row.product_image}`}

                                width='80'
                                height='60'
                              />
                            ) : (
                              <span>No image available</span>
                            )}
                            </TableCell>
                            <TableCell align='center'>
                              <IconButton
                                color='primary'
                                onClick={(e) => handleEditClick(e, row.id)}
                                disabled={editItem}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                color='primary'
                                onClick={(e) => handleDelete(e, row.id)}
                                disabled={editItem}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      )}
                    </React.Fragment>
                  )
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={item.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

      </Paper>
      <Snackbar open={opens} autoHideDuration={3000} onClose={handleClosebar}>
        <MuiAlert onClose={handleClosebar} severity={severity} elevation={6} variant="filled">
          {snackContent}
        </MuiAlert>
      </Snackbar>

    </Box>
  )
}