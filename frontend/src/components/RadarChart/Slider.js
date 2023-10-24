function Slider({name, onChange, currentValue}) {

  return (
    <div className="slider">
        <input 
            type="range" 
            className={name}
            value={currentValue}
            min="0" 
            max="4" 
            step={1}
            onChange={onChange}
        />
    </div>  
  )
}

export {Slider}