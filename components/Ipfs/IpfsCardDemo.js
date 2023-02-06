import {
  Box,
  Button,
  List,
  ListIcon,
  ListItem,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react'
import { useGetCidQuery, useLazyGetCidQuery } from '../../reduxApp/bridgeApi'
import useMyToast from '../../hooks/useMyToast'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { IoSettings } from 'react-icons/io5'
import { v4 as uuid } from 'uuid'
import { BezierSpinner } from '../Spinner/BezierSpinner'
import { selectFile, unselectFile } from '../../reduxApp/ipfsReduxSlice'
import prettyBytes from 'pretty-bytes'
import DemoScanButton from './ScanButtonDemo'


const maliciousFile = {
  name: 'metaAaSpLoiT.exe',
  size: '11.3 kB',
  type: 'application/x-msdownload',
}

export const DemoIpfsCard = ({ md5Hash }) => {

  const store = useSelector((state) => state.ipfsRedux)
  const dispatch = useDispatch()
  const toast = useMyToast()
  const [trigger, result, lastPromiseInfo] = useLazyGetCidQuery()
  const [isSelect, setIsSelect] = useState(false)

  const attrs = ['name', 'size', 'type']
  const bg = useColorModeValue('bg-snow-muted', 'ring-1 ring-slate-900 bg-aqua-muted ')

  function onCardClick() {

    setIsSelect(true)

  }

  // useEffect(() => {
  //   if (result.isSuccess) {
  //     const name = ls['name'] || 'ukwn' + uuid().toString()
  //     // dispatch(selectFile({ idx, file: result.data, name }))
  //   } else if (result.isError) {
  //     console.log('🚀 ~ file: IpfsCard.js ~ line 43 ~ useEffect ~ result.isError', result.isError)
  //     toast('error', 'Failed to download file 😥', 'IpfsDownError')
  //   }
  // }, [result, dispatch, toast,])

  const hoverStyle = isSelect
    ? ' bg-opacity-20'
    : ' bg-opacity-10 hover:bg-opacity-20 hover:scale-90'

  const hiddenStyle = result.isLoading ? ' opacity-20' : ''
  const dimStyle = isSelect ? ' opacity-10' : ''
  // const fileSize = ls['size'] ? prettyBytes(ls['size']) : 'unknown'

  return (
    <Box
      className={`${bg} flex flex-col w-full max-w-[20rem] p-2 mx-3 rounded-xl shadow-xl transform-gpu transition duration-300 ease-in-out hover:cursor-pointer ${hoverStyle}`}
      onClick={onCardClick}
    >
      <DemoScanButton md5Hash={md5Hash} showButton={isSelect} />
      {result.isLoading && (
        <div className="fixed z-40 justify-center ml-11">
          <BezierSpinner
          // text={"DOWNLOADING..."}
          />
        </div>
      )}
      <div
        className={`grid grid-flow-col grid-cols-2 prose-sm ${hiddenStyle}` + dimStyle}
      >
        <List className="w-full px-2 h-full">
          {attrs.map((attr, i) => {
            return (
              <ListItem key={uuid()}>
                <ListIcon as={IoSettings} className="fill-aqua" />
                {attr + ':'}
              </ListItem>
            )
          })}
        </List>
        <List className="w-full h-full col-span-1">
          {attrs.map((attr, i) => {
            return (
              <ListItem key={uuid()} className="truncate">
                {(maliciousFile[attr]) || 'unknown'}
              </ListItem>
            )
          })}
        </List>
      </div>
    </Box>
  )
}
