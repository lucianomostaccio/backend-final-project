// export function improvedReplies0(req, res, next) {
//   res['created'] = (payload) => {
//     res.status(201).json({ status: 'success', payload })
//   }
//   res['result'] = (payload) => {
//     res.status(200).json({ status: 'success', payload })
//   }
//   res['deleted'] = () => {
//     res.status(204).json({ status: 'success', message: "deleted successfully" })
//   }
//   res['updated'] = (payload) => {
//     res.status(204).json({ status: 'success', message: "updated successfully" , payload })
//   }
//   next()
// }



export const improvedReplies = (req, res, next) => {
  res['created'] = (payload) => { //res.created
    res.status(201).json({ status: 'success', payload })
  }
  res['ok'] = () => { //res.deleted
    res.status(204).json({ status: 'success', message: "request completed successfully" })
  }
  res['jsonOk'] = (payload) => {  //res.result or res.updated(includes payload)
    res.json({ status: 'success', payload })
  }
  res['jsonError'] = (error) => {
    res.json({ status: 'error', message: error.message, error })
  }
  next()
}