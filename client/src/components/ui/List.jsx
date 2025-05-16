import { Fragment } from "react"

export const List = ({ data, getKey, getItem }) => data?.map((item, index) => (
  <Fragment key={getKey?.(item) || index}>
    {getItem(item, index)}
  </Fragment>
))