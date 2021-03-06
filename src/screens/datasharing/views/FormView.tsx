import React, {useCallback, useState, useLayoutEffect, useRef} from 'react';
import {Box, CodeInput, Text, Button} from 'components';
import {useI18n} from '@shopify/react-i18n';
import {useReportDiagnosis} from 'services/ExposureNotificationService';
import {findNodeHandle, AccessibilityInfo} from 'react-native';

export interface FormViewProps {
  value: string;
  onChange: (value: string) => void;
  onSuccess: () => void;
  onError: () => void;
}

export const FormView = ({value, onChange, onSuccess, onError}: FormViewProps) => {
  const [i18n] = useI18n();
  const [loading, setLoading] = useState(false);
  const {startSubmission} = useReportDiagnosis();
  const handleVerify = useCallback(async () => {
    setLoading(true);
    try {
      await startSubmission(value);
      setLoading(false);
      onSuccess();
    } catch {
      setLoading(false);
      onError();
    }
  }, [startSubmission, value, onSuccess, onError]);

  const titleRef = useRef<any>(null);
  useLayoutEffect(() => {
    const tag = findNodeHandle(titleRef.current);
    if (tag) {
      AccessibilityInfo.setAccessibilityFocus(tag);
    }
  }, []);

  return (
    <>
      <Box marginHorizontal="m" marginBottom="l">
        <Text variant="bodyTitle" color="overlayBodyText" accessibilityRole="header" accessible ref={titleRef}>
          {i18n.translate('DataUpload.FormView.Title')}
        </Text>
      </Box>
      <Box marginHorizontal="m" marginBottom="l">
        <Text color="overlayBodyText">{i18n.translate('DataUpload.FormView.Body')}</Text>
      </Box>
      <Box marginBottom="m">
        <CodeInput
          value={value}
          onChange={onChange}
          accessibilityLabel={i18n.translate('DataUpload.FormView.InputLabel')}
        />
      </Box>
      <Box flex={1} marginHorizontal="m" marginBottom="m">
        <Button
          loading={loading}
          disabled={value.length !== 8}
          variant="thinFlat"
          text={i18n.translate('DataUpload.FormView.Action')}
          onPress={handleVerify}
        />
      </Box>
    </>
  );
};
