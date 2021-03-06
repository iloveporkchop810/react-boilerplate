import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import Wrapper from 'components/Wrapper';
import Button from 'components/Button';
import H2 from 'components/H2';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import InpiroBot from '../InspiroBot/index';
import { makeSelectError, makeSelectSuccess } from '../App/selectors';
import { makeSelectUserInput, makeSelectAuthor } from './selectors';
import { saveToDb } from '../App/actions';
import { changeTextInput, changeAuthor } from './actions';
import saga from './sagas';
import reducer from './reducer';

const InputBox = styled.input`
  border: 1px solid blue;
  border-radius: 3px;
  background: silver;
  width: ${props => (props.small ? '20%' : '80%')};
  margin: 20px;
  padding: 0.5em;
  color: DarkSlateGrey;
`;

const InputContainer = styled.div`
  diplay: inline-block;
  font-style: italic;
`;

export class InputPage extends React.PureComponent {
  render() {
    const { error, input, author } = this.props;
    return (
      <Wrapper>
        <H2>GIVE ME THAT CLEVER ONE LINER</H2>
        <InputContainer>
          Drum Roll~
          <InputBox
            id="textInput"
            placeholder="Show me what you got!"
            value={input}
            onChange={this.props.onChangeUserInput}
          />
        </InputContainer>
        <InputContainer>
          Credit shall be given where credit is due:
          <InputBox
            small
            id="author"
            placeholder="Author Name"
            value={author}
            onChange={this.props.onChangeAuthor}
          />
          <Button onClick={this.props.onSubmit}>IMMORTALIZE</Button>
          {error ? <p>Something went wrong...</p> : null}
        </InputContainer>
        <InpiroBot />
      </Wrapper>
    );
  }
}

InputPage.propTypes = {
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  input: PropTypes.string,
  author: PropTypes.string,
  success: PropTypes.bool,
  onChangeUserInput: PropTypes.func,
  onChangeAuthor: PropTypes.func,
  onSubmit: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onChangeUserInput: e => dispatch(changeTextInput(e.target.value)),
    onChangeAuthor: e => dispatch(changeAuthor(e.target.value)),
    onSubmit: () => {
      dispatch(saveToDb());
      alert('Saved! Checkout the Output Page for your collection!');
      dispatch(changeAuthor(''));
      dispatch(changeTextInput(''));
    },
  };
}

const mapStateToProps = createStructuredSelector({
  error: makeSelectError(),
  success: makeSelectSuccess(),
  input: makeSelectUserInput(),
  author: makeSelectAuthor(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'inputPage', reducer });
const withSaga = injectSaga({ key: 'inputPage', saga });

export default compose(
  withConnect,
  withSaga,
  withReducer,
)(InputPage);
