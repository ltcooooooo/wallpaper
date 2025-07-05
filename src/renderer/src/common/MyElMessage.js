export default ({ type, message }) => {
    ElMessage({
        message,
        type,
        plain: true,
        offset: 46
    })
}