import {
  Box,
  Button,
  List,
  ListIcon,
  ListItem,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react'
import { useLsCidQuery } from '../../reduxApp/bridgeApi'
import useMyToast from '../../hooks/useMyToast'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { IoSettings } from 'react-icons/io5'
import { v4 as uuid } from 'uuid'
import { IpfsCard } from './IpfsCard'
import { BezierSpinner } from '../Spinner/BezierSpinner'
import { reset } from '../../reduxApp/ipfsReduxSlice'
import { DopeAlter } from '../Alert/dopeAlert'
import { motion, AnimatePresence } from 'framer-motion'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { DemoIpfsCard } from './IpfsCardDemo'
import IpfsInput from './IpfsInput'

export default function IpfsLs() {
  const store = useSelector((state) => state.ipfsRedux)
  const dispatch = useDispatch()
  const toast = useMyToast()
  const { currentData, data, error, isLoading, isError } = useLsCidQuery({ cid: store.cid ? store.cid : skipToken })

  useEffect(() => {
    if (store.cid && isError) {
      toast('error', 'No files found related to this CID 💔', 'ipfsCidError')
      console.log('🚀 ~ file: IpfsLs.js ~ line 11 ~ IpfsLs ~ error', error)
      dispatch(reset())
    }
    console.log(store.cid)
  }, [isError, dispatch, toast, error, store.cid])

  return (
    <div className="w-full overflow-y-clip mt-11 ">
      <IpfsInput />
      {isLoading ? (
        <BezierSpinner></BezierSpinner>
      ) : (
        <AnimatePresence>
          <div
            className="mt-0 w-full h-full"
          >

            {/* <Box className="flex flex-col w-full "> */}
            <motion.div
              // initial={false}
              className='w-full h-full mt-32 sm:mt-0 xl:mt-52'
              animate={(currentData && store.cid) ? 'visible' : 'hidden'}
              exit={{ opacity: 0, }}
              transition={{ ease: "easeInOut", duration: .5 }}
              variants={{
                visible: { visibility: 'visible', y: 0 },
                hidden: { visibility: 'hidden', y: 500 },
              }}
            >
              {store.selectedIdx.length === 0 ?
                <DopeAlter
                  headText="Select files."
                  bodyText="These are the files inside your CID. Select the ones you want to inspect."
                  color="aqua"
                  show={true}
                />
                :
                <DopeAlter
                  headText="Malware Scan."
                  bodyText="Click on 'Scan' to initiate a malware scan."
                  color="aqua"
                  show={true}
                />}
            </motion.div>
          </div>
          <div
            className='absolute  sm:-top-9 w-full sm:max-w-[35vw] overflow-y-clip max-h-[60vw] sm:h-[102vh] sm:max-h-[122rem] justify-center items-center -mx-6  max-w-[100vw] overflow-clip'
          >

            <motion.div
              className="grid grid-flow-col sm:grid-flow-row sm:grid-cols-1 gap-3 overflow-x-scroll sm:overflow-y-scroll scrollbar-hide px-6 sm:px-0 xl:px-6 pb-6 sm:pt-[22rem] xl:py-[30vh]  "
              initial={{ opacity: 0, x: -500 }}
              animate={(data && store.cid) ? 'visible' : 'hidden'}
              exit={{ opacity: 0 }}
              transition={{ ease: "easeInOut", duration: .5 }}
              variants={{
                visible: { opacity: 1, x: 0 },
                hidden: { opacity: 0, x: -500 },
              }}
            >

              {data?.map((file, i) => {
                return (
                  <IpfsCard ls={file} idx={i} key={uuid()} />
                )
              })}
              <DemoIpfsCard md5Hash="193ef846f77e3c0770dd4db567258cde" />
            </motion.div>
          </div>
        </AnimatePresence>
      )
      }
    </div >
  )
}
