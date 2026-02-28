import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Article from './pages/Article'
import Edit from './pages/Edit'
import Login from './pages/Login'
import Archive from './pages/Archive'
import Category from './pages/Category'
import Friends from './pages/Friends'
import Search from './pages/Search'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/article/:id" element={<Article />} />
            <Route path="/edit" element={<Edit />} />
            <Route path="/edit/:id" element={<Edit />} />
            <Route path="/login" element={<Login />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/category/:id" element={<Category />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App