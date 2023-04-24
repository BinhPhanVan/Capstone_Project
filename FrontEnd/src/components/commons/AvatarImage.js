import { Image } from 'react-bootstrap';
function AvatarImage(props)
{
    return (
        <div className="avatar-image">
            <Image
                src={props.avatar_url}
                roundedCircle
                style={{ width: '2rem', height: '2rem' }}
                className="me-2"
              />
        </div>
    )
}
export default AvatarImage;
