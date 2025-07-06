export default ({ type, message }) => {
    ElMessage({
        message,
        type: type ? type : 'success',
        plain: true,
        offset: 46
    })
}