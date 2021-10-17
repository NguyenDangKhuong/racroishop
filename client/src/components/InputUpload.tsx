import { ReactNode, useRef } from 'react'
import { InputGroup } from '@chakra-ui/react'

type FileUploadProps = {
  accept?: string
  multiple?: boolean
  children?: ReactNode
}

const FileUpload = (props: FileUploadProps) => {
  const { accept, multiple, children } = props
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleClick = () => inputRef.current?.click()

  return (
    <InputGroup onClick={handleClick}>
      <input
        type={'file'}
        multiple={multiple || false}
        hidden
        accept={accept}
        ref={e => {
          inputRef.current = e
        }}
        onChange={async e => {
          console.log('change', e.target.files)
          const data = new FormData()
          data.append('file', e.target.files)
          fetch('http://localhost:4000/api/upload', {
            method: 'post',
            body: data
          })
            .then(res => {
              res.json()
              console.log(res)
            })
            .then(data => {
              console.log(data)
            })
            .catch(err => console.log(err))
        }}
      />
      <>{children}</>
    </InputGroup>
  )
}

export default FileUpload
