import React from 'react';
import { Question, AnswerValue, FileAsset } from '../../types/survey';
import ShortTextInput from './ShortTextInput';
import LongTextInput from './LongTextInput';
import EmailInput from './EmailInput';
import SingleChoiceInput from './SingleChoiceInput';
import MultipleChoiceInput from './MultipleChoiceInput';
import FileUploadInput from './FileUploadInput';

interface Props {
  question: Question;
  value: AnswerValue;
  onChange: (value: AnswerValue) => void;
  error?: string;
}

/**
 * QuestionRenderer is the dynamic dispatch layer.
 * It reads question.type from the API and renders the correct input.
 * Adding a new question type only requires:
 *   1. A new component
 *   2. One more case here
 * No other files change.
 */
export default function QuestionRenderer({ question, value, onChange, error }: Props) {
  switch (question.type) {
    case 'short_text':
      return (
        <ShortTextInput
          question={question}
          value={(value as string) ?? ''}
          onChange={onChange}
          error={error}
        />
      );

    case 'long_text':
      return (
        <LongTextInput
          question={question}
          value={(value as string) ?? ''}
          onChange={onChange}
          error={error}
        />
      );

    case 'email':
      return (
        <EmailInput
          question={question}
          value={(value as string) ?? ''}
          onChange={onChange}
          error={error}
        />
      );

    case 'single_choice':
      return (
        <SingleChoiceInput
          question={question}
          value={(value as string) ?? ''}
          onChange={onChange}
          error={error}
        />
      );

    case 'multiple_choice':
      return (
        <MultipleChoiceInput
          question={question}
          value={(value as string[]) ?? []}
          onChange={(v) => onChange(v)}
          error={error}
        />
      );

    case 'file':
      return (
        <FileUploadInput
          question={question}
          value={(value as FileAsset[]) ?? []}
          onChange={(v) => onChange(v)}
          error={error}
        />
      );

    default:
      return null;
  }
}
