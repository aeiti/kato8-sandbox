import { useState } from 'react'
import RadioGroup from '../components/RadioGroup'

// RadioGroup is controlled, so the gallery needs a little state wrapper
// to make the preview clickable. Wrapped in .signup-form so it renders
// at the width and spacing it has inside a real form.
export default function RadioGroupPreview() {
  const [value, setValue] = useState('')
  return (
    <div className="signup-form">
      <RadioGroup
        name="preview-type"
        legend="I’m reaching out as"
        options={[
          { value: 'investor', label: 'Investor' },
          { value: 'publisher', label: 'Publisher' },
        ]}
        value={value}
        onChange={setValue}
        required
      />
    </div>
  )
}
