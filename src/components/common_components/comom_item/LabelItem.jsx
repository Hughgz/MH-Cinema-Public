import PropTypes from 'prop-types';

export const LabelItem = ({ labelName = "" }) => {
    return (
        <div>
            <li className="inline-block">
                <a className="text-black text-sm inline-flex h-8 border border-grey-20 hover:border-primary rounded-lg p-3 capitalize not-italic items-center" href="/dien-anh/hoat-hinh/">
                    {labelName}
                </a>
            </li>
        </div>
    );
};

LabelItem.propTypes = {
    labelName: PropTypes.string.isRequired,
}