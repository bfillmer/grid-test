
import React from 'react'
import styled from 'styled-components'
import postcssJs from 'postcss-js'
import autoprefixer from 'autoprefixer'
import postcss from 'postcss'

import { Block } from 'Atoms'

// Start with some css in a template literal.
const css = `
  display: grid;
  grid-gap: 2rem;
  grid-template:
      "head head  head" 1fr
      "nav  main  main" minmax(100px, 1fr)
      "nav  foot  foot" 2fr /
      1fr   100px 1fr;

  #head { grid-area: head; }
  #nav { grid-area: nav; }
  #main { grid-area: main; }
  #foot { grid-area: foot; }
`

// Convert to a CSS-in-JS object.
const root = postcss.parse(css)
const styleObject = postcssJs.objectify(root)

// Turn on grid prefixing.
const prefixGrids = autoprefixer({ grid: true })

// Run the CSS-in-JS through the autoprefixer.
// @NOTE Honestly if you define some components to exclusively control
// the grid layout, and not style them with additional styles you could
// just attach these styles to the component and call it a day.
const prefixer = postcssJs.sync([ prefixGrids ])
const prefixed = prefixer(styleObject)

// Transform the CSS-in-JS object back to a css string.
async function getCss (prefixedCJS) {
  const css = await postcss().process(prefixedCJS, { parser: postcssJs }).then((result) => {
    return result.css
  })
  return css
}

// Styled component that wraps our autoprefixed css.
const StyledGrid = styled('div')`
  ${props => props.css}
`

// Since we leverage getCss, which is async, we need to wrap things and
// only render once we have our css. Near enough to instantaneous.
class Grid extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  async componentDidMount () {
    const css = await getCss(prefixed)
    this.setState({
      css
    })
  }

  render () {
    const {children} = this.props
    const {css} = this.state

    return (
      <React.Fragment>
        {css &&
          <StyledGrid css={css}>
            {children}
          </StyledGrid>
        }
      </React.Fragment>
    )
  }
}

export function Home () {
  return (
    <Grid>
      <div id='head'>
        <Block />
      </div>
      <div id='nav'>
        <Block />
      </div>
      <div id='main'>
        <Block />
      </div>
      <div id='foot'>
        <Block />
      </div>
    </Grid>
  )
}
