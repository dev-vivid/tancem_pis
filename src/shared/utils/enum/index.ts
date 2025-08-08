enum MediumEnum {
  Tamil = "Tamil",
  English = "English",
}

export default MediumEnum;


export const getArrayFromEnumType = (type: any)=>{
    return Object.keys(type) as Array<keyof typeof type>
}
