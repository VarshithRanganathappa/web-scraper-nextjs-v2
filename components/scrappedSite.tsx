
import { useState } from 'react'
import ModalCompact from './ModalCompact';
// import Modal from 'react-modal';

type ScrappedSiteProps = {
  contents: {
    link: string,
    data: string[]
  }
}

export default function ScrappedSite(props: ScrappedSiteProps) {
  const contents = props.contents;
  const [showModal, setShowModal] = useState(false);

  const modalShowHandler = () => {
    console.log("clicked")
    setShowModal(!showModal);
  }
  return (
    <div className="my-3 w-full max-w-screen-xl animate-[slide-down-fade_0.5s_ease-in-out] grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
      <div onClick={modalShowHandler} className="ml-5 p-5 bg-slate-600 rounded-xl max-w-5xl hover:cursor-pointer hover:text-gray-100">
        <span onClick={modalShowHandler} className="text-sm text-gray-300 hover:text-gray-100 hover:cursor-pointer" key={contents.link}>{contents.link}</span>
      </div>
      <ModalCompact showModal={showModal} closeModal={modalShowHandler} contentBody={sentences(contents.data)} link={contents.link}/>
    </div>
  )
}


const sentences = (dataArray: string[]) => {
  let sentences: JSX.Element[] = [];
  dataArray.forEach((data: any) => {
    sentences.push(
      <div className='divide-y divide-dashed'>
        <p className='mt-4'>{data}</p>
      </div>
    );
  })
  return sentences;
}