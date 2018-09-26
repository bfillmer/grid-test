
import React from 'react'
import styled from 'styled-components'
import { Router } from '@reach/router'

import { Home } from 'Screens'

const StyledRouter = styled(Router)`
  width: 100%;
  height: 100%;
`

export function Routes () {
  return (
    <StyledRouter>
      <Home default path='/' />
    </StyledRouter>
  )
}
