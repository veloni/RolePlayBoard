interface IProps {
    setPageState: (value: string) => void;
    pageState: string;
    options: string[];
};

export const AsideMenu = (props: IProps) => {

  return (
    <div className={'aside__blocks'}>
        <div className={'app__aside'}>
            <span 
                className={`${props.pageState === 'Управление монитором' ? 'switcher-option-active' : ''}`}
                onClick={() => props.setPageState('Управление монитором')}
            >
                {'Управление монитором'}
            </span>

            {props.options.map((option, index) => (
                <span 
                    key={index}
                    onClick={() => props.setPageState(option)}
                    className={`switcher-option ${
                        props.pageState === option ? 'switcher-option-active' : ''
                    }`}
                >
                    {option}
                </span>
            ))}


            <span 
                className={`${props.pageState === 'Статы' ? 'switcher-option-active' : ''}`}
                onClick={() => props.setPageState('Статы')}
            >
                {'Статы'}
            </span>


            <span 
                className={`${props.pageState === 'Музыка' ? 'switcher-option-active' : ''}`}
                onClick={() => props.setPageState('Музыка')}
            >
                {'Музыка'}
            </span>
        </div>
    </div>
  );
};