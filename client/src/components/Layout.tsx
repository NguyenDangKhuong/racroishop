import { ReactNode } from 'react'
import Navbar from './NavBar'
import Wrapper from './Wrapper'

interface ILayoutProps {
  children: ReactNode
}

const Layout = ({ children }: ILayoutProps) => {
  return (
    <>
      <Navbar />
      <Wrapper>{children}</Wrapper>
    </>
  )
}

export default Layout
