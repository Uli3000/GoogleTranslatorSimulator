import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useStore } from './hooks/useStore';
import { Container, Row, Col, Button, Stack } from 'react-bootstrap';
import { AUTO_LANGUAGE } from './constants';
import { ArrowsIcon, ClipboardIcon, SpeakerIcon } from './components/Icons';
import { LanguageSelector } from './components/LanguageSelector';
import { SectionType } from './types.d';
import { TextArea } from './components/TextArea';
import { useEffect } from 'react';
import { translate } from './services/translate';
import { useDebounce } from './hooks/useDebounce';

function App() {
  const { fromLanguage, toLanguage, interchangeLanguages, setFromLanguage, setToLanguage, fromText, setFromText, result, setResult, loading } = useStore()

  const debounceFromText = useDebounce(fromText, 375)

  useEffect(() => {
    if (debounceFromText !== '') {
      translate({ fromText: debounceFromText, fromLanguage, toLanguage }).then((res) => {
        if (res == null || res == undefined) return
        setResult(res)
      }).catch(() => {
        console.error('Intente de nuevo mas tarde, demasiadas solicitudes')
        setResult('Error')
      })

    }
  }, [debounceFromText, toLanguage, fromLanguage])

  const handleClickboard = () => {
    navigator.clipboard.writeText(result)
  }

  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(result)
    utterance.lang = toLanguage
    speechSynthesis.speak(utterance)
  }

  return (
    <Container>
      <h2 style={{textAlign: 'center', paddingBottom: '28px', fontFamily: 'monospace', fontSize: '36px'}}>Google Translate</h2>

      <Row>
        <Col>
          <Stack gap={2}>
            <LanguageSelector type={SectionType.From}
              value={fromLanguage} onChange={setFromLanguage} />
              <TextArea
                type={SectionType.From}
                value={fromText}
                onChange={setFromText}
              />
          </Stack>
        </Col>

        <Col xs='auto'>
          <Button variant='link' disabled={fromLanguage === AUTO_LANGUAGE} onClick={interchangeLanguages}>
            <ArrowsIcon />
          </Button>
        </Col>

        <Col>
          <Stack gap={2}>
            <LanguageSelector type={SectionType.To} value={toLanguage} onChange={setToLanguage} />
            <div style={{ position: 'relative' }}>
              <TextArea
                loading={loading}
                type={SectionType.To}
                value={result}
                onChange={setResult}
              />
              <div style={{ position: 'absolute', left: 0, bottom: 0, display: 'flex' }}>
                <Button variant='link' onClick={handleClickboard}>
                  <ClipboardIcon />
                </Button>
                <Button variant='link' onClick={handleSpeak}>
                  <SpeakerIcon />
                </Button>
              </div>
            </div>
          </Stack>
        </Col>
      </Row>
    </Container>
  )
}

export default App
