import { Transition } from '@headlessui/react';
import Image from 'next/image';

const BackgroundImage = ({ src, alt, generatedValue }: {src: string, alt: string, generatedValue: boolean}) => {
    return (
      <Transition
        show={generatedValue}
        enter="transition-opacity duration-1000"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-1000"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0">
          <Image 
            src={src} 
            alt={alt}
            layout="fill"
            objectFit="cover"
            priority={true}
          />
        </div>
      </Transition>
    )
  }
  
  export default BackgroundImage;