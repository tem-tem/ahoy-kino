import React, { useCallback, useContext } from 'react'
import { ImgOContext } from '../ImageOverlay'
import styles from './styles.module.scss'
import { Screen } from '~/types'

interface Props {
  screens: Screen[]
  title: string
}

export default ({ screens, title }: Props) => {
  const { open: openImgO } = useContext(ImgOContext)
  const full = screens.map((s) => s.publicUrls.full)

  const handleImageClick = useCallback(
    (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
      // const gallery = new Viewer(document.getElementById('imagesContainer'))

      const index = Number(e.currentTarget.getAttribute('data-img-index'))
      openImgO(full, index, title)
    },
    [full]
  )

  const imgTags = screens.map((s, index) => (
    <img
      src={s.publicUrls.thumb}
      key={s.publicUrls.thumb}
      onClick={handleImageClick}
      data-img-index={index}
    />
  ))
  return <div className={styles.container}>{imgTags}</div>
}
