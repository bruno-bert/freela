export function normalizePhone(value:string|null|undefined):string|null{
 const number=(value??'').trim().replace(/\s*(?:ext(?:ension)?\.?|ramal|x|#)\s*:?\s*\d+\s*$/i,'').replace(/\D/g,'').replace(/^00/,'');
 return /^[1-9]\d{7,14}$/.test(number)?number:null;
}
