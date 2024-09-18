
export default async function handleClick(calledFunction:Function) {
    
try{
    await calledFunction()
}catch(err){
    console.log(err)
}
}